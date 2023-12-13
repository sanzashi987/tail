export type NodeArrangeOptions = {
  /**
   * @not_used
   */
  brushSize: number;
  /**
   * @not_used
   */
  relaxPower: number;
  /**
   * @not_used
   */
  slidePower: number;
  /**
   * @not_used
   */
  collisionPower: number;
  /**
   * @description base distance applied when calculate next up/downstream node location
   * @default 80
   */
  distance: number;
  /**
   * @default true
   */
  adpativeIter: boolean;
  /**
   * @description only arrange selected nodes
   * @default false
   */
  onlySelected: boolean;
  /**
   * @description Loop size for the No.1 step
   * @default 200
   */
  iterates_1: number;
  /**
   * @description Loop size for the No.2 step
   * @default 200
   */
  iterates_2: number;
  /**
   * @description Loop size for the No.3 step
   * @default 200
   */
  iterates_3: number;
  /**
   * @description Loop size for the No.4 step
   * @default 200
   */
  iterates_4: number;
};

export type AffiliateOptions = {
  /**
   * @description gain for the movement of signle node rearranged the in No.1 step
   * @default 1
   */
  influence_1: number;
  /**
   * @description gain for the force pulling away the up/downstream nodes in No.1 step
   * @default 1
   */
  relaxPower_1: number;
  /**
   * @description  gain for the movement of signle node rearranged the in No.2 step
   * @default 1
   */
  influence_2: number;
  /**
   * @description gain for the force pulling away the up/downstream nodes in No.2 step
   * @default 1
   */
  relaxPower_2: number;
  /**
   * @description gain for the movement of signle node rearranged the in No.4 step
   * @default 0.2
   */
  influence_4: number;
  /**
   * @description gain for the force pulling away the up/downstream nodes in No.4 step
   * @default 1
   */
  relaxPower_4: number;
};

export type TailArrangeOptions = NodeArrangeOptions & AffiliateOptions;
