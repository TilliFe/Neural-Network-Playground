fn gr_ReLU(gId : vec3u, currTensor : u32, childTensor: u32){
    let curr_m = u32(ping.entries[u32(offset.tensor[currTensor].rows)]);    
    let curr_n = u32(ping.entries[u32(offset.tensor[currTensor].cols)]);
 
    let curr_Data = u32(offset.tensor[currTensor].data);
    let curr_GradientData = u32(offset.tensor[currTensor].gradientData);
    let child_GradientData = u32(offset.tensor[childTensor].gradientData);

    if (gId.x >= curr_m || gId.y >= curr_n) {
        return; // Guard against out-of-bounds work group sizes
    }

    let index = gId.x * curr_n + gId.y;
    if(ping.entries[curr_Data + index] >= f32(0)){
        ping.entries[curr_GradientData + index] += ping.entries[child_GradientData + index];
    }
    else{
        ping.entries[curr_GradientData + index] = f32(0);
    }
}