/**
 * @file Root app route.
 */

import { redirect } from "next/navigation";

/**
 * Redirects the root route to the recipes listing.
 *
 * @returns {never} Next.js redirect response (throws internally).
 */
const Home = () => redirect("/recepti");

export default Home;
