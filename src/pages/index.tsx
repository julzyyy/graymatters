import type { NextPage } from "next";

import DeadFriendsSection from "../components/DeadFriendsSection";
import HeroSection from "../components/HeroSection";

const Home: NextPage = () => {
  return (
    <div>
      <HeroSection />
      {<DeadFriendsSection />}
    </div>
  );
};

export default Home;
