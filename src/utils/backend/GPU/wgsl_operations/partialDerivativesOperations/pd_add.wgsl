fn pd_add(gId : vec3u, t : u32, currParent : u32){
    let curr_m = u32(ping.entries[u32(offset.tensor[t].rows)]);
    let curr_n = u32(ping.entries[u32(offset.tensor[t].cols)]);
    let curr_pdLeft = u32(offset.tensor[t].partialDerivativeLeft);
    let curr_pdRight = u32(offset.tensor[t].partialDerivativeRight);

    if (gId.x >= u32(1) || gId.y >= curr_n) {
        return; // Guard against out-of-bounds work group sizes
    }

    let resultCell = vec2(gId.x, gId.y);
    let index = resultCell.y + resultCell.y * curr_n;
    ping.entries[curr_pdLeft + index] = f32(1);
    ping.entries[curr_pdRight + index] = f32(1);
} 