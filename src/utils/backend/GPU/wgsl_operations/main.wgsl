@group(0) @binding(0) var<storage, read> offset : Offsets;
@group(0) @binding(1) var<storage, read_write> ping : FlatData;
@group(0) @binding(2) var<storage, read_write> backwardTape : BackwardTape;
@group(0) @binding(3) var<storage, read_write> control : Control;
@group(0) @binding(4) var<storage, read_write> inputData : InputData;
@group(0) @binding(5) var<storage, read_write> gradientTape : GradientTape;
@group(0) @binding(6) var<storage, read_write> trueValues : TrueValues;
@group(0) @binding(7) var<storage, read_write> accuracies : array<f32>;

@compute @workgroup_size(16,16)
fn main(@builtin(global_invocation_id) gId : vec3u) {
    let t = u32(control.currTensor);
    let computeType = u32(control.computeType);

    if(computeType == u32(0)){
        copyInput(gId,t);
    }
    else if(computeType == u32(1)){
        forward(gId,t);
    }
    else if(computeType == u32(2)){
        computePartialDerivatives(gId,t);
    }
    else if(computeType == u32(3)){
        computeGradients(gId,t);
    }
    else if(computeType == u32(4)){
        updateData(gId,t);
    }
}