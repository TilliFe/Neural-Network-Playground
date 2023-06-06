fn gr_multiply(gId : vec3u, currTensor : u32, childTensor: u32){

    let curr_m = u32(ping.entries[u32(offset.tensor[currTensor].rows)]);    
    let curr_n = u32(ping.entries[u32(offset.tensor[currTensor].cols)]);

    if (gId.x >= curr_m || gId.y >= curr_n) {
        return; // Guard against out-of-bounds work group sizes
    }

    let childGradient_m = u32(ping.entries[u32(offset.tensor[childTensor].rows)]);    
    let childGradient_n = u32(ping.entries[u32(offset.tensor[childTensor].cols)]);
    
    let currGradientFirst = u32(offset.tensor[currTensor].gradientData);
    let child_GradientDataFirst = u32(offset.tensor[childTensor].gradientData);
    let isRightMultiplicator = u32(ping.entries[u32(offset.tensor[currTensor].isRightMultiplicator)]);
    let requiresGradient = u32(ping.entries[u32(offset.tensor[currTensor].requiresGradient)]);

    // compute gradient x partialDerivativeLeft  ~  (childGradient_m x childGradient_n) x (right_n x right_m)  ~  (curr_m x childGradient_n) x (childGradient_n x curr_n)
    if(isRightMultiplicator == u32(0)){
        let child_PD = u32(offset.tensor[childTensor].partialDerivativeLeft);

        var result = 0.0;
        for (var i = 0u; i < childGradient_n; i = i + 1u) {
            let a = child_GradientDataFirst + i + gId.x * childGradient_n;
            let b = child_PD + gId.y + i * curr_n;
            result += ping.entries[a] * ping.entries[b];
        }
        let index = currGradientFirst + gId.y + gId.x * curr_n;
        ping.entries[index] += result;
    }

    // compute partialDerivativeRight x gradient   ~  (left_n x left_m) x (childGradient_m x childGradient_n)  ~  (curr_m x childGradient_m) x (childGradient_m x curr_n)
    else{
        let child_PD = u32(offset.tensor[childTensor].partialDerivativeRight);
        var result = 0.0;
        for (var i = 0u; i < childGradient_m; i = i + 1u) {
            let a = child_PD + i + childGradient_m * gId.x;
            let b = child_GradientDataFirst + i * curr_n + gId.y; 
            result = result + ping.entries[a] * ping.entries[b];
        }
        let index = currGradientFirst + gId.y + gId.x * curr_n;
        ping.entries[index] += result;
    }
}