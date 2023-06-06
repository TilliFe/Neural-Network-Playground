fn multiplyTensors(gId : vec3u, t : u32){
  let curr_m = u32(ping.entries[u32(offset.tensor[t].rows)]);
  let curr_n = u32(ping.entries[u32(offset.tensor[t].cols)]);
  let curr_DataFirstIndex = u32(offset.tensor[t].data);
  let curr_ParentLeft = u32(ping.entries[u32(offset.tensor[t].parents)]);
  let curr_ParentRight = u32(ping.entries[u32(offset.tensor[t].parents) + 1u]);
  let parentLeft_DataFirstIndex = u32(offset.tensor[curr_ParentLeft].data);
  let parentRight_DataFirstIndex = u32(offset.tensor[curr_ParentRight].data);
  let parentLeft_m = u32(ping.entries[u32(offset.tensor[curr_ParentLeft].rows)]);
  let parentLeft_n = u32(ping.entries[u32(offset.tensor[curr_ParentLeft].cols)]);
  let parentRight_n = u32(ping.entries[u32(offset.tensor[curr_ParentRight].cols)]);

  if (gId.x >= parentLeft_m || gId.y >= parentRight_n) {
    return; // Guard against out-of-bounds work group sizes
  }

  let resultCell = vec2(gId.x, gId.y);
  var result = 0.0;
  for (var i = 0u; i < parentLeft_n; i = i + 1u) {
    let a = parentLeft_DataFirstIndex + i + resultCell.x * parentLeft_n;
    let b = parentRight_DataFirstIndex + resultCell.y + i * parentRight_n;
    result += ping.entries[a] * ping.entries[b];
  }
  let index = resultCell.y + resultCell.x * parentRight_n;
  ping.entries[curr_DataFirstIndex + index] = result;
}