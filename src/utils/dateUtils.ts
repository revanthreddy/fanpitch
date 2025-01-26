/**
 * Base timestamp for the mock conversation (2024-09-19T23:22:26.211Z)
 * This corresponds to the start of our conversation snippet from the MLB game
 */
export const MOCK_CONVERSATION_BASE_TIME = new Date(
  '2024-09-19T22:52:22.211Z',
).getTime();

// Store initialization time to calculate offset
const INIT_TIME = Date.now();

/**
 * Returns a timestamp that increments in real-time, starting from MOCK_CONVERSATION_BASE_TIME
 * The time will increment at the same rate as real time, just offset to start
 * from our mock conversation's beginning
 */
export const getMockTime = () => {
  const elapsedSinceInit = Date.now() - INIT_TIME;
  return MOCK_CONVERSATION_BASE_TIME + elapsedSinceInit;
};
