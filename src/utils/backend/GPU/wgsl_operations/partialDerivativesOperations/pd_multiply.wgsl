fn pdLeft_multiply(gId : vec3u, t : u32){
    let curr_m = u32(ping.entries[u32(offset.tensor[t].rows)]);
    let curr_n = u32(ping.entries[u32(offset.tensor[t].cols)]);
    let curr_ParentLeft = u32(ping.entries[u32(offset.tensor[t].parents)]);
    let curr_ParentRight = u32(ping.entries[u32(offset.tensor[t].parents) + 1u]);
    let parentRight_DataFirstIndex = u32(offset.tensor[curr_ParentRight].data);
    let parentLeft_m = u32(ping.entries[u32(offset.tensor[curr_ParentLeft].rows)]);
    let parentLeft_n = u32(ping.entries[u32(offset.tensor[curr_ParentLeft].cols)]);
    let parentRight_m = u32(ping.entries[u32(offset.tensor[curr_ParentRight].rows)]);
    let parentRight_n = u32(ping.entries[u32(offset.tensor[curr_ParentRight].cols)]);
    let curr_pdLeft = u32(offset.tensor[t].partialDerivativeLeft);

    if ( gId.x >= parentRight_m || gId.y >= parentRight_n){
        return; // Guard against out-of-bounds work group sizes
    }

    // ~ trans((1.0 / (double) n) * right.getData());
    let indexParRight = parentRight_DataFirstIndex + gId.y  + gId.x * parentRight_n;
    let indexPdLeft = curr_pdLeft + gId.x + gId.y * parentRight_m;
    ping.entries[indexPdLeft] = ping.entries[indexParRight] / f32(parentRight_n);          
}

fn pdRight_multiply(gId : vec3u, t : u32){
    let curr_m = u32(ping.entries[u32(offset.tensor[t].rows)]);
    let curr_n = u32(ping.entries[u32(offset.tensor[t].cols)]);
    let curr_ParentLeft = u32(ping.entries[u32(offset.tensor[t].parents)]);
    let curr_ParentRight = u32(ping.entries[u32(offset.tensor[t].parents) + 1u]);
    let parentLeft_DataFirstIndex = u32(offset.tensor[curr_ParentLeft].data);
    let parentLeft_m = u32(ping.entries[u32(offset.tensor[curr_ParentLeft].rows)]);
    let parentLeft_n = u32(ping.entries[u32(offset.tensor[curr_ParentLeft].cols)]);
    let parentRight_m = u32(ping.entries[u32(offset.tensor[curr_ParentRight].rows)]);
    let parentRight_n = u32(ping.entries[u32(offset.tensor[curr_ParentRight].cols)]);
    let curr_pdRight = u32(offset.tensor[t].partialDerivativeRight);

    if ( gId.x >= parentLeft_m || gId.y >= parentLeft_n){
        return; // Guard against out-of-bounds work group sizes
    }

    //  ~ trans((1.0 / (double) n) * left.getData());
    let indexParLeft = parentLeft_DataFirstIndex + gId.y + gId.x * parentLeft_n;
    let indexPdRight = curr_pdRight  + gId.x + gId.y * parentLeft_m;
    ping.entries[indexPdRight] = ping.entries[indexParLeft] / f32(parentRight_n);
}

fn pd_multiply(gId : vec3u, t : u32, currParentId : u32){
    let isRightMultiplicator = u32(ping.entries[u32(offset.tensor[currParentId].isRightMultiplicator)]);
    if(isRightMultiplicator == u32(0)){
        pdLeft_multiply(gId, t);
    }
    else{
        pdRight_multiply(gId, t);
    }
}