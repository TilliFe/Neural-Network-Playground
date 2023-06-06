fn softmaxTensor(gId : vec3u, t : u32){
    let curr_m = u32(ping.entries[u32(offset.tensor[t].rows)]);
    let curr_n = u32(ping.entries[u32(offset.tensor[t].cols)]);
    let curr_DataFirstIndex = u32(offset.tensor[t].data);
    let curr_ParentSingle = u32(ping.entries[u32(offset.tensor[t].parents)]);
    let parentSingle_DataFirstIndex = u32(offset.tensor[curr_ParentSingle].data);

    if (gId.x >= u32(1) || gId.y >= u32(curr_n)) {
        return; // Guard against out-of-bounds work group sizes
    }

    let resultCell = vec2(gId.x, gId.y);
    var add = f32(0.0);
    for (var i = 0u; i < curr_m; i = i + 1u) {
        let idx = parentSingle_DataFirstIndex + resultCell.y + i * curr_n;  // sum column wise
        add = add + exp(ping.entries[idx]);
    }
    for (var i = 0u; i < curr_m; i = i + 1u) {
        let idxParent = parentSingle_DataFirstIndex + resultCell.y + i * curr_n;
        let idxRes = curr_DataFirstIndex + resultCell.y + i * curr_n;
        if(add > f32(0)){
            ping.entries[idxRes] = exp(ping.entries[idxParent]) / add;
        }
        else{
            ping.entries[idxRes] = f32(0);
        }
    }
}