

export const preparePipelines = (pipelines) => {
  let prevPipeline = null
  let prevPrevPipeline = null
  
  pipelines.forEach(({node: pipeline}) => {

    if (pipeline.isLost) {
      if (!prevPipeline) {
        pipeline.isHidden = true
      }
      if (pipeline.isMerge && prevPipeline && !prevPipeline.isMerge) {
        prevPipeline.isHidden = true
        if (prevPrevPipeline) {
          prevPrevPipeline.isDirect = true
        }
      }
      if (pipeline.isMerge && prevPipeline && prevPipeline.isMerge) {
        pipeline.isHidden = true
        pipeline.isRemove = true
      }
      if (pipeline.isMerge && !prevPipeline.isMerge) {
        if (pipeline.groups.edges.filter(group => group.node.groupParticipants.edges.length > 1).length == 0) {
          pipeline.isRemove = true
          if (prevPipeline) {
            prevPipeline.isRemove = true
          }
        }
      }
    } else {
      if (pipeline.isMerge && prevPipeline && !prevPipeline.isMerge) {
        prevPipeline.isDirect = true
      }
    }

    prevPrevPipeline = prevPipeline
    prevPipeline = pipeline

  })

  pipelines = pipelines.filter(pipeline => !pipeline.node.isRemove)

  return pipelines
}