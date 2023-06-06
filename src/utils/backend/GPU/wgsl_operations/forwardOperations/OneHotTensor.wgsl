fn OneHotTensor(gId : vec3u, t : u32){
    let curr_m = u32(ping.entries[u32(offset.tensor[t].rows)]);
    let curr_n = u32(ping.entries[u32(offset.tensor[t].cols)]);
    let curr_DataFirstIndex = u32(offset.tensor[t].data);
    let curr_ParentSingle = u32(ping.entries[u32(offset.tensor[t].parents)]);
    let parentSingle_DataFirstIndex = u32(offset.tensor[curr_ParentSingle].data);

    if (gId.x >= u32(1) || gId.y >= u32(curr_n)) {
        return; // Guard against out-of-bounds work group sizes
    }

    let resultCell = vec2(gId.x, gId.y);
    var max = f32(0.0);
    var maxIndex = u32(0);
    for (var i = 0u; i < curr_m; i = i + 1u) {
        let idx = parentSingle_DataFirstIndex + resultCell.y + i * curr_n;  // sum column wise
        if(ping.entries[idx] > max){
            max = ping.entries[idx];
            maxIndex = i;
        }
    }
    for (var i = 0u; i < curr_m; i = i + 1u) {
        let parentIdx = parentSingle_DataFirstIndex + resultCell.y + i * curr_n;  // sum column wise
        let currIdx = curr_DataFirstIndex + resultCell.y + i * curr_n;  // sum column wise
        if(i == maxIndex){
            ping.entries[currIdx] = f32(1);
        }
        else{
            ping.entries[currIdx] = f32(0);
        }
    }
}