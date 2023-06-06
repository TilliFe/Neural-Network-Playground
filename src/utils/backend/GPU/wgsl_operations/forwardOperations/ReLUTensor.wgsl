fn ReLUTensor(gId : vec3u, t : u32){
    let curr_TensorType = u32(ping.entries[u32(offset.tensor[t].types)]);
    let curr_m = u32(ping.entries[u32(offset.tensor[t].rows)]);
    let curr_n = u32(ping.entries[u32(offset.tensor[t].cols)]);
    let curr_DataFirstIndex = u32(offset.tensor[t].data);
    let curr_ParentSingle = u32(ping.entries[u32(offset.tensor[t].parents)]);
    let parentSingle_DataFirstIndex = u32(offset.tensor[curr_ParentSingle].data);

    if (gId.x >= curr_m || gId.y >= curr_n) {
        return; // Guard against out-of-bounds work group sizes
    }

    let resultCell = vec2(gId.x, gId.y);
    let index = resultCell.y + resultCell.x * curr_n;
    if(ping.entries[parentSingle_DataFirstIndex + index] >= 0){
        ping.entries[curr_DataFirstIndex + index] = ping.entries[parentSingle_DataFirstIndex + index];
    }
    else{
        ping.entries[curr_DataFirstIndex + index] = f32(0);
    }
}