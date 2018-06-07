export const getTrackerIdentifiers = (org, trackerType) => {
  if(org && org.trackers){
      return org.trackers
        .filter((tracker) => tracker.type == trackerType)
        .map((tracker) => tracker.identifier);
    } else {
      return [];
    }
}
