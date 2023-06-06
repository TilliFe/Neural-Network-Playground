fn copyInput(gId : vec3u, currTensorId : u32){
    let inputDataId = u32(inputData.tensorId);
    let trueValuesId = u32(trueValues.tensorId);

    if(currTensorId == inputDataId){
        let rows = u32(inputData.rows);
        let cols = u32(inputData.cols);
        let curr_DataFirstIndex = u32(offset.tensor[currTensorId].data);

        if (gId.x >= rows || gId.y >= cols) {
            return; // Guard against out-of-bounds work group sizes
        }

        let index = gId.y + gId.x * cols;
        ping.entries[curr_DataFirstIndex + index] = inputData.entries[index]; 
    }
    else if(currTensorId == trueValuesId){
        let rows = u32(trueValues.rows);
        let cols = u32(trueValues.cols);
        let curr_DataFirstIndex = u32(offset.tensor[currTensorId].data);

        if (gId.x >= rows || gId.y >= cols) {
            return; // Guard against out-of-bounds work group sizes
        }

        let index = gId.y + gId.x * cols;
        ping.entries[curr_DataFirstIndex + index] = trueValues.entries[index]; 
    }
}