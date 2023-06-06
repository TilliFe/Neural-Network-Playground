fn gr_correlate(gId : vec3u, currTensor : u32, childTensor: u32){

    // let curr_m = u32(ping.entries[u32(offset.tensor[currTensor].rows)]);    
    // let curr_n = u32(ping.entries[u32(offset.tensor[currTensor].cols)]);

    // if (gId.x >= curr_m || gId.y >= curr_n) {
    //     return; // Guard against out-of-bounds work group sizes
    // }

    // let childGradient_m = u32(ping.entries[u32(offset.tensor[childTensor].rows)]);    
    // let childGradient_n = u32(ping.entries[u32(offset.tensor[childTensor].cols)]);
    
    // let currGradientFirst = u32(offset.tensor[currTensor].gradientData);
    // let child_GradientDataFirst = u32(offset.tensor[childTensor].gradientData);
    // let isKernel = u32(ping.entries[u32(offset.tensor[currTensor].isRightMultiplicator)]);
    // let requiresGradient = u32(ping.entries[u32(offset.tensor[currTensor].requiresGradient)]);

    // // child_gr full_crosscoorelate_with rotate180(kernel)
    // if(isKernel == u32(0)){
    //     let kernelsize_m = curr_m - childGradient_m + 1u; // this is true for now but has to be change for padding and stride  !!!!!!!
    //     let kernelsize_n = curr_n - childGradient_n + 1u;
    //     let pd_left = u32(offset.tensor[childTensor].partialDerivativeLeft);
    //     var result = 0.0;

    //     var i_start = u32(0);
    //     var j_start = u32(0);
    //     var i_end = kernelsize_m;
    //     var j_end = kernelsize_n;

    //     if(gId.x < kernelsize_m - 1){
    //         i_start = gId.x;
    //     }
    //     if(gId.y < kernelsize_n - 1){
    //         j_start = gId.y;
    //     }
    //     if(gId.x > curr_m - kernelsize_m + 1){
    //         i_end = curr_m - gId.x;
    //     }
    //     if(gId.y < curr_n - kernelsize_n + 1){
    //         j_end = curr_n - gId.y;
    //     }

    //     for (var i = i_start; i < i_end; i = i + 1u) {
    //         for (var j = j_start; j < j_end; j = j + 1u) {
    //             let a = child_GradientDataFirst + gId.y + (j - j_start) + (gId.x + i - i_start) * childGradient_n;
    //             let b = pd_left + j + i * kernelsize_n; 
                
    //             result += ping.entries[a] * ping.entries[b];
    //         }
    //     }
    //     let index = currGradientFirst + gId.y + gId.x * curr_n;
    //     ping.entries[index] = result;
    // }

    // // X crosscoorelate_with child_gr
    // else{
    //     let curr_dim1 = u32(ping.entries[u32(offset.tensor[currTensor].metaDims)]);
    //     let curr_dim2 = u32(ping.entries[u32(offset.tensor[currTensor].metaDims) + 1u]);

    //     let child_dim1 = u32(ping.entries[u32(offset.tensor[childTensor].metaDims)]);
    //     let child_dim2 = u32(ping.entries[u32(offset.tensor[childTensor].metaDims) + 1u]);

    //     let stride = u32(1);
    //     let padding = u32(0);

    //     let X_dim2 = child_dim2 + curr_dim2 - 1u;
    //     let pd_right = u32(offset.tensor[childTensor].partialDerivativeRight);

    //     let in_row = curr_dim1 * u32( floor( f32(gId.x) / f32(child_dim1) ) ); 

    //     var result = 0.0;
    //     for (var i = 0u; i < child_dim1; i = i + 1u) {
    //         for (var j = 0u; j < child_dim2; j = j + 1u) {
    //             let a = pd_right + gId.y + X_dim2 * in_row + j + i * X_dim2;
    //             let b = child_GradientDataFirst + gId.y + (j + i * child_dim2) * child_n; 
                
    //             result += ping.entries[a] * ping.entries[b];
    //         }
    //     }

    //     for (var i = 0u; i < childGradient_m; i = i + 1u) {
    //         for (var j = 0u; j < childGradient_n; j = j + 1u) {
    //             let a = pd_right + gId.y + j + (gId.x + i) * X_n;
    //             let b = child_GradientDataFirst + j + i * childGradient_n; 
                
    //             result += ping.entries[a] * ping.entries[b];
    //         }
    //     }
    //     let index = currGradientFirst + gId.y + gId.x * curr_n;
    //     ping.entries[index] = result;
    // }
}