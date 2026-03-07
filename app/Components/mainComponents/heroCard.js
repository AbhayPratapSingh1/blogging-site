

import { HeroPostDetail ,  HeroPostImage } from "./HeroCard/HeroBlogBlocks";

const HeroCard = ({data}) => {  
    return (
      <div className="w-full grid md:grid-cols-2 md:max-h-96 overflow-hidden">
        <HeroPostImage data={data}/>
        <HeroPostDetail data={data}/>
      </div>
    );
};

export default HeroCard