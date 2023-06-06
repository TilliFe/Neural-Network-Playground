fn computePartialDerivatives(gId : vec3u, currentTensorId : u32){    

    let currParentId = u32(control.currParent);
    let curr_TensorType = u32(ping.entries[u32(offset.tensor[currentTensorId].types)]);

    if(curr_TensorType == u32(1)){
        pd_add(gId, currentTensorId, currParentId);
    }
    else if(curr_TensorType == u32(2)){
        pd_multiply(gId, currentTensorId, currParentId);
    }
    else if(curr_TensorType == u32(3)){
        // ReLUTensor(gId,t);
    }
    else if(curr_TensorType == u32(4)){
        // softmaxTensor(gId,t);
    }
    else if(curr_TensorType == u32(5)){
        pd_softmaxCE(gId, currentTensorId, currParentId);
    }
    else if(curr_TensorType == u32(7)){
        pd_MSE(gId, currentTensorId, currParentId);
    }
    else if(curr_TensorType == u32(8)){
        pd_correlate(gId, currentTensorId, currParentId);
    }
}