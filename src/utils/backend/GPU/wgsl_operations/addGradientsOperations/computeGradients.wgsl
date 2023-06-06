fn computeGradients(gId : vec3u, t : u32){

    let childTensor = u32(control.currChild);
    let child_TensorType = u32(ping.entries[u32(offset.tensor[childTensor].types)]);
    
    if(child_TensorType == u32(1)){
        gr_add(gId,t,childTensor);
    }
    else if(child_TensorType == u32(2)){
        gr_multiply(gId,t,childTensor);
    }
    else if(child_TensorType == u32(3)){
        gr_ReLU(gId,t,childTensor);
    }
    else if(child_TensorType == u32(4)){
        gr_softmaxCE(gId,t,childTensor);
    }
    else if(child_TensorType == u32(7)){
        gr_MSE(gId,t,childTensor); 
    }
    else if(child_TensorType == u32(8)){
        gr_correlate(gId,t,childTensor); 
    }
}