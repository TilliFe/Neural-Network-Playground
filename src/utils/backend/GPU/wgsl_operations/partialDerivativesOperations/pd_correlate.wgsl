fn pdLeft_correlate(gId : vec3u, t : u32){
    // let curr_m = u32(ping.entries[u32(offset.tensor[t].rows)]);
    // let curr_n = u32(ping.entries[u32(offset.tensor[t].cols)]);
    // let curr_ParentLeft = u32(ping.entries[u32(offset.tensor[t].parents)]);
    // let curr_ParentRight = u32(ping.entries[u32(offset.tensor[t].parents) + 1u]);
    // let parentRight_DataFirstIndex = u32(offset.tensor[curr_ParentRight].data);
    // let parentLeft_m = u32(ping.entries[u32(offset.tensor[curr_ParentLeft].rows)]);
    // let parentLeft_n = u32(ping.entries[u32(offset.tensor[curr_ParentLeft].cols)]);
    // let parentRight_m = u32(ping.entries[u32(offset.tensor[curr_ParentRight].rows)]);
    // let parentRight_n = u32(ping.entries[u32(offset.tensor[curr_ParentRight].cols)]);
    // let curr_pdLeft = u32(offset.tensor[t].partialDerivativeLeft);

    // if ( gId.x >= parentRight_m || gId.y >= parentRight_n){
    //     return; // Guard against out-of-bounds work group sizes
    // }

    // // copy rotate180(kernel) into pd_X
    // let indexParRight = parentRight_DataFirstIndex + gId.y + gId.x * parentRight_n;
    // let indexPdLeft = curr_pdLeft + gId.y * parentRight_m  + gId.x;
    // ping.entries[indexPdLeft] = ping.entries[indexParRight];
}

fn pdRight_correlate(gId : vec3u, t : u32){
    // let curr_m = u32(ping.entries[u32(offset.tensor[t].rows)]);
    // let curr_n = u32(ping.entries[u32(offset.tensor[t].cols)]);
    // let curr_ParentLeft = u32(ping.entries[u32(offset.tensor[t].parents)]);
    // let curr_ParentRight = u32(ping.entries[u32(offset.tensor[t].parents) + 1u]);
    // let parentLeft_DataFirstIndex = u32(offset.tensor[curr_ParentLeft].data);
    // let parentLeft_m = u32(ping.entries[u32(offset.tensor[curr_ParentLeft].rows)]);
    // let parentLeft_n = u32(ping.entries[u32(offset.tensor[curr_ParentLeft].cols)]);
    // let parentRight_m = u32(ping.entries[u32(offset.tensor[curr_ParentRight].rows)]);
    // let parentRight_n = u32(ping.entries[u32(offset.tensor[curr_ParentRight].cols)]);
    // let curr_pdRight = u32(offset.tensor[t].partialDerivativeRight);

    // if ( gId.x >= parentLeft_m || gId.y >= parentLeft_n){
    //     return; // Guard against out-of-bounds work group sizes
    // }

    // // copy X into pd_kernel
    // let indexParLeft = parentLeft_DataFirstIndex + gId.y + gId.x * parentLeft_n;
    // let indexPdRight = curr_pdRight + gId.y + gId.x * parentLeft_n;
    // ping.entries[indexPdRight] = ping.entries[indexParLeft];
}

fn pd_correlate(gId : vec3u, t : u32, currParentId : u32){
    let isKernel = u32(ping.entries[u32(offset.tensor[currParentId].isRightMultiplicator)]);
    if(isKernel == u32(0)){
        pdLeft_correlate(gId, t);
    }
    else{
        pdRight_correlate(gId, t);
    }
}