import type { StaffMember, StaffRole } from "@/lib/types";
import type { Rng } from "@/lib/engine/rng";
import { shuffle } from "@/lib/engine/rng";

const POOL: StaffMember[] = [
  { id: "hale", name: "Marcus Hale", role: "hc", scheme: "Outside zone", leadership: 5, development: 3, aggression: 3, culture: 5, cost: 3, blurb: "Players stay. The building gets quieter and harder to play against." },
  { id: "peck", name: "Dana Peck", role: "hc", scheme: "Play-action", leadership: 4, development: 4, aggression: 4, culture: 3, cost: 2, blurb: "Wants the quarterback to throw on time and the staff to stop improvising." },
  { id: "rios", name: "Andre Rios", role: "hc", scheme: "Spread", leadership: 3, development: 5, aggression: 5, culture: 2, cost: 2, blurb: "Will play rookies. Will also empty the playbook on fourth-and-2." },
  { id: "croft", name: "Helen Croft", role: "hc", scheme: "Gap scheme", leadership: 4, development: 2, aggression: 2, culture: 4, cost: 2, blurb: "Old-school week. Low drama. The offense is not going to surprise anyone." },
  { id: "bellamy", name: "Chris Bellamy", role: "hc", scheme: "Match quarters", leadership: 5, development: 2, aggression: 4, culture: 3, cost: 3, blurb: "A defensive head coach who wants stars and does not develop them." },
  { id: "okonkwo", name: "Ife Okonkwo", role: "hc", scheme: "Wide zone", leadership: 3, development: 5, aggression: 3, culture: 5, cost: 1, blurb: "Cheap, patient, and allergic to veterans who skip meetings." },
  { id: "vale", name: "Sam Vale", role: "oc", scheme: "Shanahan tree", leadership: 3, development: 4, aggression: 4, culture: 3, cost: 2, blurb: "Motion, outside zone, and a quarterback who gets the ball out." },
  { id: "pruitt", name: "Lila Pruitt", role: "oc", scheme: "Air raid", leadership: 2, development: 5, aggression: 5, culture: 2, cost: 1, blurb: "Empty formations and a lot of throws. The line has to be real." },
  { id: "cho", name: "Minh Cho", role: "oc", scheme: "Under center", leadership: 4, development: 2, aggression: 2, culture: 4, cost: 2, blurb: "Play-action and a fullback. Asks the defense to be bored." },
  { id: "doyle", name: "Patrick Doyle", role: "oc", scheme: "RPO", leadership: 3, development: 4, aggression: 4, culture: 3, cost: 2, blurb: "Wants a mobile quarterback and a receiver who can win the slot." },
  { id: "nash", name: "Robin Nash", role: "oc", scheme: "Power", leadership: 4, development: 3, aggression: 3, culture: 4, cost: 1, blurb: "Two tight ends and a back who falls forward." },
  { id: "quinn", name: "Ellis Quinn", role: "dc", scheme: "Wide-9", leadership: 3, development: 3, aggression: 5, culture: 2, cost: 2, blurb: "Rush four and dare you to block them. Gives up some explosives." },
  { id: "hart", name: "Noelle Hart", role: "dc", scheme: "Two-high", leadership: 4, development: 4, aggression: 2, culture: 4, cost: 2, blurb: "Takes the deep ball away and lives with the checkdown." },
  { id: "briggs", name: "Calvin Briggs", role: "dc", scheme: "Odd front", leadership: 5, development: 2, aggression: 4, culture: 3, cost: 3, blurb: "A loud room and a lot of simulated pressure." },
  { id: "santos", name: "Eva Santos", role: "dc", scheme: "Cover 3", leadership: 3, development: 5, aggression: 3, culture: 5, cost: 1, blurb: "Develops corners. Does not blitz herself into a headline." },
  { id: "reed", name: "Jonah Reed", role: "dc", scheme: "Man heavy", leadership: 4, development: 3, aggression: 4, culture: 2, cost: 2, blurb: "Press man and a single high safety. Corners have to be real." },
  { id: "adebayo", name: "Tunde Adebayo", role: "scout", scheme: "Southeast", leadership: 3, development: 5, aggression: 2, culture: 4, cost: 2, blurb: "Accurate on skill, foggy on the trenches. Your board will be honest." },
  { id: "fischer", name: "Greta Fischer", role: "scout", scheme: "Big Ten", leadership: 4, development: 3, aggression: 2, culture: 4, cost: 1, blurb: "Loves linemen and linebackers. Will miss a slot receiver." },
  { id: "park", name: "Owen Park", role: "scout", scheme: "National", leadership: 2, development: 4, aggression: 3, culture: 3, cost: 3, blurb: "A national crosschecker. Expensive, and less wrong than the room." },
  { id: "ibarra", name: "Luz Ibarra", role: "scout", scheme: "Group of Five", leadership: 3, development: 5, aggression: 3, culture: 4, cost: 1, blurb: "Finds day-two starters. The first-round grades have more noise." },
  { id: "mckay", name: "Bill McKay", role: "scout", scheme: "Defense", leadership: 4, development: 2, aggression: 3, culture: 3, cost: 2, blurb: "A former coach. Great on fit, average on projection." },
];

export function staffMarket(rng: Rng, legends: StaffMember[] = []): Record<StaffRole, StaffMember[]> {
  const roles: StaffRole[] = ["hc", "oc", "dc", "scout"];
  const market = {} as Record<StaffRole, StaffMember[]>;
  for (const role of roles) {
    const legend = legends.find((s) => s.role === role);
    const pool = shuffle(
      POOL.filter((s) => s.role === role && s.id !== legend?.id),
      rng,
    );
    const picked = pool.slice(0, legend ? 2 : 3);
    market[role] = legend ? [legend, ...picked] : picked;
  }
  return market;
}

export const ROLE_LABEL: Record<StaffRole, string> = {
  hc: "Head coach",
  oc: "Offensive coordinator",
  dc: "Defensive coordinator",
  scout: "Scouting director",
};
