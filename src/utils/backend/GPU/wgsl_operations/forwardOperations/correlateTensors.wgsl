// this code assumes a 'valid' cross correlation in the forward pass !
fn correlateTensors(gId : vec3u, t : u32){
//   let curr_m = u32(ping.entries[u32(offset.tensor[t].rows)]);  // cols of result matrix
//   let curr_n = u32(ping.entries[u32(offset.tensor[t].cols)]);  // rows of result matrix
//   let curr_DataFirstIndex = u32(offset.tensor[t].data);
//   let in = u32(ping.entries[u32(offset.tensor[t].parents)]);
//   let kernel = u32(ping.entries[u32(offset.tensor[t].parents) + 1u]);
//   let in_DataFirstIndex = u32(offset.tensor[in].data);
//   let kernel_DataFirstIndex = u32(offset.tensor[kernel].data);
//   let in_m = u32(ping.entries[u32(offset.tensor[in].rows)]);  // cols of in matrix
//   let in_n = u32(ping.entries[u32(offset.tensor[in].cols)]);  // rows of in matrix
//   let kernel_m = u32(ping.entries[u32(offset.tensor[kernel].rows)]);  // cols of kernel matrix
//   let kernel_n = u32(ping.entries[u32(offset.tensor[kernel].cols)]);  // rows of kernel matrix

//   // let curr_metaDimsLength = 2 ?
//   let in_dim1 = u32(ping.entries[u32(offset.tensor[in].metaDims)]);
//   let in_dim2 = u32(ping.entries[u32(offset.tensor[in].metaDims) + 1u]);

//   let kernel_dim1 = u32(ping.entries[u32(offset.tensor[kernel].metaDims)]);
//   let kernel_dim2 = u32(ping.entries[u32(offset.tensor[kernel].metaDims) + 1u]);

//   let stride = u32(1);
//   let padding = u32(0);

//   if (gId.x >= curr_m || gId.y >= curr_n) {
//     return; // Guard against out-of-bounds work group sizes
//   }

//   let in_row = in_dim1 * u32( floor( f32(gId.x) / f32(kernel_dim1) ) ); 

//   var result = 0.0;
//   for (var i = 0u; i < kernel_m; i = i + 1u) {
//     for (var j = 0u; j < kernel_n; j = j + 1u) {
//         let a = kernel_DataFirstIndex + j + i * kernel_n; 
//         let b = in_DataFirstIndex + gId.y + in_n * in_row + j + i * in_dim2;

//         result += ping.entries[a] * ping.entries[b];
//     }
//   }

//   let index = gId.y + gId.x * curr_n;
//   ping.entries[curr_DataFirstIndex + index] = result;
}