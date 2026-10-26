/** A fixed English candidate list, so layout tests never depend on a database or a model. */
export const WORDS = `apple bread chair dance eagle flame grape house island jelly kettle lemon mango night ocean
piano queen river stone tiger umbrella violin water yacht zebra anchor basket candle desert engine forest garden
harbor insect jacket kitten ladder marble needle orange pepper rabbit saddle tunnel valley window yellow almond
bamboo cactus donkey falcon guitar hammer igloo jungle koala lizard meadow nickel oyster parrot quartz rocket
salmon tomato velvet walnut castle dragon ember feather glacier honey ivory jasmine lantern mirror nectar orchid
pebble quiver ribbon saffron thistle unicorn vessel willow anvil beacon cobalt dune elbow fern gravel helmet
iris jade knot lark moss nest oak plum quail reed sage tulip vine wren yarn zest arch bell cove dove fig gem
hive ink jar kiln lime mint nut opal pine rose silk tea urn vase wax yak amber blaze cider daisy ferry
goose hazel melon olive peach raven scarf trout vapor wheat`
  .split(/\s+/)
  .filter(Boolean)
