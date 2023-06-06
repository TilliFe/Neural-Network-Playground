fn updateData(gId : vec3u, t : u32){
    let curr_m = u32(ping.entries[u32(offset.tensor[t].rows)]);   
    let curr_n = u32(ping.entries[u32(offset.tensor[t].cols)]);

    let curr_Data = u32(offset.tensor[t].data);
    let curr_GradientData = u32(offset.tensor[t].gradientData);
    let curr_velocity_momentum = u32(offset.tensor[t].velocity_momentum);
    let curr_velocity_RMSProp = u32(offset.tensor[t].velocity_RMSProp);
    let curr_RequiresGradient = u32(ping.entries[u32(offset.tensor[t].requiresGradient)]);
    let learningRate = backwardTape.learningRate;
    let momentum = backwardTape.momentum;

    let iteration = control.iteration;
    
    if (gId.x >= curr_m || gId.y >= curr_n) {
        return; // Guard against out-of-bounds work group sizes or not required update of the data entries
    }

    let index = gId.x * curr_n + gId.y;
    if(curr_RequiresGradient == u32(1)){

        // ping.entries[curr_velocity_momentum + index] = (momentum * ping.entries[curr_velocity_momentum + index] + learningRate * ping.entries[curr_GradientData + index] ); // / ( f32(1) - pow(mommomentum, iteration ));
        // // ping.entries[curr_velocity_RMSProp + index] = (f32(0.999) * ping.entries[curr_velocity_RMSProp + index] + (f32(1) - f32(0.999)) * pow(ping.entries[curr_GradientData + index], f32(2) ) ) / ( f32(1) - pow(f32(0.999), iteration ));
        // ping.entries[curr_Data + index] -=  ping.entries[curr_velocity_momentum + index]; // / ( sqrt(ping.entries[curr_velocity_RMSProp + index]) + f32(0.00000001) );


        // ping.entries[curr_velocity_momentum + index] = (momentum * ping.entries[curr_velocity_momentum + index] + (f32(1) - momentum) * ping.entries[curr_GradientData + index] ) / ( f32(1) - pow(momentum, iteration ));
        // ping.entries[curr_velocity_RMSProp + index] = (f32(0.999) * ping.entries[curr_velocity_RMSProp + index] + (f32(1) - f32(0.999)) * ping.entries[curr_GradientData + index] * ping.entries[curr_GradientData + index] ); // / ( f32(1) - pow(f32(0.999), iteration ));
        // ping.entries[curr_Data + index] -= learningRate * ping.entries[curr_velocity_momentum + index] / ( sqrt(ping.entries[curr_velocity_RMSProp + index]) + f32(0.00000001) );
    
        ping.entries[curr_velocity_momentum + index] = momentum * ping.entries[curr_velocity_momentum + index] + (learningRate) * ping.entries[curr_GradientData + index];
        ping.entries[curr_Data + index] -= ping.entries[curr_velocity_momentum + index];
    }
    else {
        ping.entries[curr_Data + index] = f32(0);
    }
    ping.entries[curr_GradientData + index] = f32(0);
}