fn forward(gId : vec3u, t : u32){

    let curr_TensorType = u32(ping.entries[u32(offset.tensor[t].types)]);

    if(curr_TensorType == u32(1)){
        addTensors(gId,t);
    }
    else if(curr_TensorType == u32(2)){
        multiplyTensors(gId,t);
    }
    else if(curr_TensorType == u32(3)){
        ReLUTensor(gId,t);
    }
    else if(curr_TensorType == u32(4)){
        softmaxTensor(gId,t);
    }
    else if(curr_TensorType == u32(5)){
        CETensors(gId,t);
    }
    else if(curr_TensorType == u32(6)){
        OneHotTensor(gId,t);
    }
    else if(curr_TensorType == u32(7)){
        MSETensor(gId,t);
    }
    else if(curr_TensorType == u32(8)){
        correlateTensors(gId,t);
    }
}