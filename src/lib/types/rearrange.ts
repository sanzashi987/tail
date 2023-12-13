export type NodeArrangeOptions = {
  brushSize: number;
  distance: number;
  relaxPower: number;
  slidePower: number;
  collisionPower: number;
  adpativeIter: boolean;
  onlySelected: boolean;
  iterates_1: number;
  iterates_2: number;
  iterates_3: number;
  iterates_4: number;
};

export type AffiliateOptions = {
  influence_1: number;
  relaxPower_1: number;
  influence_2: number;
  relaxPower_2: number;
  influence_3: number;
  relaxPower_3: number;
};

export type TailArrangeOptions = NodeArrangeOptions & AffiliateOptions;
