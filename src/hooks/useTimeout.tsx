import { useState } from "react";

function useTimeout() {
  const [timeoutIds, setTimeoutIds] = useState<NodeJS.Timeout[]>([]);
  const clearAllTimeouts = () => {
    timeoutIds.forEach((timeoutId: NodeJS.Timeout) => clearTimeout(timeoutId));
    setTimeoutIds([]);
  };

  return {
    timeoutIds,
    setTimeoutIds,
    clearAllTimeouts,
  };
}

export default useTimeout;
