"""
tools/merge_pptx.py
===================
Merges two PPTX files by operating directly on the ZIP contents.
Inserts slides from a "donor" deck into specific positions in a "base" deck.

This approach is far more reliable than python-pptx's slide copying because:
  - It copies every slide XML verbatim
  - It correctly imports all media (PNG/JPG images) with new unique filenames
  - It re-wires all rId relationships so images render correctly
  - It updates presentation.xml sldIdLst to reflect the new order

Usage
-----
    from tools.merge_pptx import merge_decks
    merge_decks(
        base_path   = "build/L01/L01_full.pptx",
        donor_path  = "build/L01/L01_concepts.pptx",
        output_path = "build/L01/L01_merged.pptx",
        insertions  = [
            # (after_0indexed_base_slide, [0indexed_donor_slides...])
            (7,  [2, 3, 4, 5]),     # after HS Core Concepts, insert HS concept slides
            (14, [7, 8, 9]),        # after BegUG Core Concepts
            (21, [11, 12, 13]),     # after AdvUG Core Concepts
            (28, [15, 16]),         # after MSc Core Concepts
            (35, [18, 19]),         # after PhD Core Concepts
        ]
    )
"""

import copy
import io
import os
import re
import zipfile
from lxml import etree


# XML namespaces
_NS = {
    'p':  'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a':  'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r':  'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'rel':'http://schemas.openxmlformats.org/package/2006/relationships',
}
_REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships'
_PRS_NS = 'http://schemas.openxmlformats.org/presentationml/2006/main'


def _qn(ns_key, local):
    return '{%s}%s' % (_NS[ns_key], local)


# ── Read helpers ───────────────────────────────────────────────────────────────

def _read_xml(zf, path):
    return etree.fromstring(zf.read(path))


def _slide_paths(zf):
    """Return sorted list of slide paths: ['ppt/slides/slide1.xml', ...]"""
    paths = [n for n in zf.namelist()
             if re.match(r'ppt/slides/slide\d+\.xml$', n)]
    return sorted(paths, key=lambda p: int(re.search(r'\d+', p).group()))


def _rels_path(slide_path):
    """ppt/slides/slide3.xml  ->  ppt/slides/_rels/slide3.xml.rels"""
    parts = slide_path.rsplit('/', 1)
    return parts[0] + '/_rels/' + parts[1] + '.rels'


def _read_rels(zf, slide_path):
    """Return {rId: (Type, Target, is_external)} for a slide's .rels file."""
    rp = _rels_path(slide_path)
    if rp not in zf.namelist():
        return {}
    tree = _read_xml(zf, rp)
    out = {}
    for rel in tree:
        out[rel.get('Id')] = (
            rel.get('Type'),
            rel.get('Target'),
            rel.get('TargetMode', '') == 'External',
        )
    return out


def _build_rels_xml(rels):
    """Build .rels XML bytes from {rId: (Type, Target, is_ext)} dict."""
    root = etree.Element(
        '{%s}Relationships' % _REL_NS,
        nsmap={None: _REL_NS},
    )
    for rid, (rtype, target, is_ext) in rels.items():
        el = etree.SubElement(root, '{%s}Relationship' % _REL_NS)
        el.set('Id', rid)
        el.set('Type', rtype)
        el.set('Target', target)
        if is_ext:
            el.set('TargetMode', 'External')
    return etree.tostring(root, xml_declaration=True,
                          encoding='UTF-8', standalone=True)


# ── Presentation manifest helpers ──────────────────────────────────────────────

def _read_prs_rels(zf):
    """Read ppt/_rels/presentation.xml.rels -> {rId: (Type, Target)}"""
    tree = _read_xml(zf, 'ppt/_rels/presentation.xml.rels')
    return {r.get('Id'): (r.get('Type'), r.get('Target'))
            for r in tree}


def _slide_layout_path(zf, slide_path):
    """Return the slideLayout target path for a given slide."""
    rels = _read_rels(zf, slide_path)
    for rid, (rtype, target, _) in rels.items():
        if 'slideLayout' in rtype:
            # target is relative: '../slideLayouts/slideLayout1.xml'
            base = '/'.join(slide_path.split('/')[:-1])
            return os.path.normpath(base + '/' + target).replace('\\', '/')
    return None


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN MERGE FUNCTION
# ═══════════════════════════════════════════════════════════════════════════════

def merge_decks(base_path, donor_path, output_path, insertions):
    """
    Parameters
    ----------
    base_path   : str  path to the base PPTX
    donor_path  : str  path to the donor PPTX (concept slides)
    output_path : str  where to write the merged PPTX
    insertions  : list of (after_base_0idx, [donor_0idx, ...])
        Slides from donor_0idx list are inserted after base slide after_base_0idx.
        Indices are 0-based.
    """
    base_zf  = zipfile.ZipFile(base_path,  'r')
    donor_zf = zipfile.ZipFile(donor_path, 'r')

    base_slides  = _slide_paths(base_zf)
    donor_slides = _slide_paths(donor_zf)

    print(f"  Base:  {len(base_slides)} slides")
    print(f"  Donor: {len(donor_slides)} slides")

    # ── Build insertion map: at which positions to insert donor slides ─────────
    # insertions are (after_idx, [donor_idxs])
    # We'll build the final ordered list: [(source, slide_path), ...]
    # source = 'base' or 'donor'

    # Sort insertions by after_idx descending so indices don't shift
    sorted_insertions = sorted(insertions, key=lambda x: x[0])

    final_order = []  # list of ('base'|'donor', slide_path)
    insert_map  = {}  # base_0idx -> [donor_paths]
    for after_idx, donor_idxs in sorted_insertions:
        insert_map[after_idx] = [donor_slides[i] for i in donor_idxs]

    for i, sp in enumerate(base_slides):
        final_order.append(('base', sp))
        if i in insert_map:
            for dp in insert_map[i]:
                final_order.append(('donor', dp))

    print(f"  Merged: {len(final_order)} slides")
    for src, sp in final_order:
        tag = "  [CONCEPT]" if src == 'donor' else ""
        num = re.search(r'\d+', sp).group()
        print(f"    {src[0].upper()} slide{num}{tag}")

    # ── Copy everything into the output ZIP ───────────────────────────────────
    # Strategy:
    #   1. Copy all non-slide content from base verbatim
    #   2. Number slides sequentially 1..N
    #   3. For each slide, copy XML + remap media from donor into base namespace
    #   4. Update presentation.xml sldIdLst

    out_buf = io.BytesIO()
    out_zf  = zipfile.ZipFile(out_buf, 'w', zipfile.ZIP_DEFLATED)

    # Track media already copied: donor_path -> new_filename_in_ppt/media/
    donor_media_map = {}   # 'ppt/media/image3.png' -> 'ppt/media/image103.png'

    # Find highest existing media index in base
    base_media = [n for n in base_zf.namelist() if n.startswith('ppt/media/')]
    max_media_idx = 0
    for m in base_media:
        nums = re.findall(r'\d+', m.split('/')[-1])
        if nums:
            max_media_idx = max(max_media_idx, int(nums[0]))
    next_media_idx = max_media_idx + 1

    # ── Step 1: copy all base non-slide files verbatim ────────────────────────
    skip_base = set()
    for sp in base_slides:
        skip_base.add(sp)
        skip_base.add(_rels_path(sp))
    # Also skip presentation.xml (we'll rewrite it)
    skip_base.add('ppt/presentation.xml')
    skip_base.add('ppt/_rels/presentation.xml.rels')

    for name in base_zf.namelist():
        if name in skip_base:
            continue
        data = base_zf.read(name)
        out_zf.writestr(name, data)

    # ── Step 2: copy donor media into output (with new names) ─────────────────
    donor_media = [n for n in donor_zf.namelist() if n.startswith('ppt/media/')]
    for dm in donor_media:
        fname = dm.split('/')[-1]
        ext   = fname.rsplit('.', 1)[-1] if '.' in fname else 'bin'
        new_fname = f'image{next_media_idx}.{ext}'
        new_path  = f'ppt/media/{new_fname}'
        donor_media_map[dm] = new_path
        out_zf.writestr(new_path, donor_zf.read(dm))
        next_media_idx += 1

    # ── Step 3: write all merged slides ───────────────────────────────────────
    # Track new slide rIds for presentation.xml
    new_slide_rids = []   # list of (new_slide_path, layout_target_rel_to_ppt)

    # Read base prs rels to know existing slide rIds and max rId
    base_prs_rels = _read_prs_rels(base_zf)
    max_rid_num = 0
    for rid in base_prs_rels:
        m = re.search(r'\d+', rid)
        if m:
            max_rid_num = max(max_rid_num, int(m.group()))
    next_rid_num = max_rid_num + 1

    # Also read donor prs rels for layout mapping
    donor_prs_rels = _read_prs_rels(donor_zf)

    for new_idx, (src, orig_path) in enumerate(final_order, 1):
        zf_src  = base_zf if src == 'base' else donor_zf
        new_sp  = f'ppt/slides/slide{new_idx}.xml'
        new_rp  = f'ppt/slides/_rels/slide{new_idx}.xml.rels'

        # Read original slide XML
        slide_xml = zf_src.read(orig_path)

        # Read original rels
        orig_rels = _read_rels(zf_src, orig_path)

        if src == 'donor':
            # Remap media rIds: update Target paths for image rels
            new_rels = {}
            rid_remap = {}  # old rId -> same rId (targets get remapped)

            for rid, (rtype, target, is_ext) in orig_rels.items():
                if 'image' in rtype.lower() or target.startswith('../media/'):
                    # Resolve target relative to slide
                    if target.startswith('../media/'):
                        orig_media = 'ppt/media/' + target[len('../media/'):]
                    else:
                        orig_media = 'ppt/slides/' + target
                    orig_media = orig_media.replace('\\', '/')

                    new_media = donor_media_map.get(orig_media, orig_media)
                    # Make target relative to ppt/slides/
                    new_target = '../media/' + new_media.split('ppt/media/')[-1]
                    new_rels[rid] = (rtype, new_target, is_ext)
                elif 'slideLayout' in rtype:
                    # Keep layout rel as-is (layouts from base are compatible enough)
                    # Map to base's first layout as fallback
                    new_rels[rid] = (rtype, '../slideLayouts/slideLayout1.xml', is_ext)
                elif 'notesSlide' in rtype:
                    pass  # skip notes
                else:
                    new_rels[rid] = (rtype, target, is_ext)
        else:
            # Base slide: keep rels as-is, but layout target may need adjustment
            new_rels = dict(orig_rels)

        # Write slide XML
        out_zf.writestr(new_sp, slide_xml)

        # Write slide .rels
        rels_xml = _build_rels_xml(new_rels)
        out_zf.writestr(new_rp, rels_xml)

        # Find layout rel target for prs rels
        layout_target = '../slideLayouts/slideLayout1.xml'
        for rid, (rtype, target, _) in new_rels.items():
            if 'slideLayout' in rtype:
                layout_target = target
                break

        new_slide_rids.append((new_sp, layout_target))

    # ── Step 4: rewrite presentation.xml ──────────────────────────────────────
    prs_xml = _read_xml(base_zf, 'ppt/presentation.xml')

    # Update sldIdLst
    sld_id_lst = prs_xml.find('.//{%s}sldIdLst' % _PRS_NS)
    if sld_id_lst is None:
        raise RuntimeError("Could not find sldIdLst in presentation.xml")

    # Remove all existing slide entries
    for el in list(sld_id_lst):
        sld_id_lst.remove(el)

    # Build new prs rels dict (non-slide rels from base + new slide rels)
    new_prs_rels = {rid: (rtype, target)
                    for rid, (rtype, target) in base_prs_rels.items()
                    if 'slide' not in target.lower()
                    or 'slideLayout' in target
                    or 'slideMaster' in target
                    or 'notesMaster' in target}

    # Add slide rels and sldIdLst entries
    slide_type = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide'
    start_id   = 256  # standard starting slide id
    for i, (new_sp, layout_target) in enumerate(new_slide_rids):
        rid = f'rId{next_rid_num}'
        next_rid_num += 1
        target = new_sp.replace('ppt/', '')  # relative to ppt/
        new_prs_rels[rid] = (slide_type, target)

        # sldIdLst entry
        sld_el = etree.SubElement(sld_id_lst, '{%s}sldId' % _PRS_NS)
        sld_el.set('id', str(start_id + i))
        sld_el.set('{%s}id' % _NS['r'], rid)

    out_zf.writestr('ppt/presentation.xml',
                    etree.tostring(prs_xml, xml_declaration=True,
                                   encoding='UTF-8', standalone=True))

    # ── Step 5: rewrite ppt/_rels/presentation.xml.rels ───────────────────────
    prs_rels_root = etree.Element(
        '{%s}Relationships' % _REL_NS, nsmap={None: _REL_NS})
    for rid, (rtype, target) in new_prs_rels.items():
        el = etree.SubElement(prs_rels_root, '{%s}Relationship' % _REL_NS)
        el.set('Id', rid); el.set('Type', rtype); el.set('Target', target)

    out_zf.writestr('ppt/_rels/presentation.xml.rels',
                    etree.tostring(prs_rels_root, xml_declaration=True,
                                   encoding='UTF-8', standalone=True))

    out_zf.close()
    base_zf.close()
    donor_zf.close()

    # Write output file
    with open(output_path, 'wb') as f:
        f.write(out_buf.getvalue())

    size_kb = os.path.getsize(output_path) // 1024
    print(f"\n  ✓ Written: {output_path}  ({size_kb}KB)")
    return output_path


# ── CLI ────────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    import sys
    sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))

    merge_decks(
        base_path   = 'build/L01/L01_full.pptx',
        donor_path  = 'build/L01/L01_concepts.pptx',
        output_path = 'build/L01/L01_merged.pptx',
        insertions  = [
            # (after 0-based slide index in base, [0-based indices in donor])
            # Insert HS concept slides (donor 2-5) after HS Core Concepts (base idx 7)
            (7,  [2, 3, 4, 5]),
            # Insert BegUG concept slides (donor 7-9) after BegUG Core Concepts (base idx 14)
            (14, [7, 8, 9]),
            # Insert AdvUG concept slides (donor 11-13) after AdvUG Core Concepts (base idx 21)
            (21, [11, 12, 13]),
            # Insert MSc concept slides (donor 15-16) after MSc Core Concepts (base idx 28)
            (28, [15, 16]),
            # Insert PhD concept slides (donor 18-19) after PhD Core Concepts (base idx 35)
            (35, [18, 19]),
        ],
    )
