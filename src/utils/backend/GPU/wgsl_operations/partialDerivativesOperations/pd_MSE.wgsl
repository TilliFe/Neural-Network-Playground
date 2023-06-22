fn pd_MSE(gId : vec3u, t : u32, currParent : u32){
    let curr_m = u32(ping.entries[u32(offset.tensor[t].rows)]);
    let curr_n = u32(ping.entries[u32(offset.tensor[t].cols)]);
    let curr_ParentTrue = u32(ping.entries[u32(offset.tensor[t].parents)]);
    let curr_ParentPred = u32(ping.entries[u32(offset.tensor[t].parents + 1)]);
    let parentTrue_m = u32(ping.entries[u32(offset.tensor[curr_ParentTrue].rows)]);  // is same as parentPred_m and also parentPred_parentSingle_m
    let parentTrue_n = u32(ping.entries[u32(offset.tensor[curr_ParentTrue].cols)]);  // is same as parentPred_n and also parentPred_parentSingle_n
    let curr_pdTrue = u32(offset.tensor[t].partialDerivativeLeft);
    let curr_pdPred = u32(offset.tensor[t].partialDerivativeRight);

    let currPd_parentTrue = u32(offset.tensor[t].partialDerivativeLeft);
    let currPd_parentPred = u32(offset.tensor[t].partialDerivativeRight);
    let parentPred_dataFirstIndex = u32(offset.tensor[curr_ParentPred].data);
    let parentTrue_dataFirstIndex = u32(offset.tensor[curr_ParentTrue].data);

    if (gId.x >= parentTrue_m || gId.y >= parentTrue_n) {
        return; // Guard against out-of-bounds work group sizes
    }

    let index = gId.y + gId.x * parentTrue_n;
    ping.entries[currPd_parentTrue + index] = (f32(2) / ( f32(parentTrue_m))) * ( ping.entries[parentPred_dataFirstIndex + index] - ping.entries[parentTrue_dataFirstIndex + index] );
    ping.entries[currPd_parentPred + index] = (f32(2) / ( f32(parentTrue_m))) * ( ping.entries[parentPred_dataFirstIndex + index] - ping.entries[parentTrue_dataFirstIndex + index] );
}