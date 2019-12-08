import { MakeCoverBeginCall } from "../generated/templates/Pool1/Pool1"
import { Cover } from "../generated/schema"
import { isLatestNexusContract, getInsuredContract } from "./helpers";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleNewCover(call: MakeCoverBeginCall): void {
  if (isLatestNexusContract("pool1", call.to)) {
    let id = call.transaction.hash.toHex();
    let entity = Cover.load(id)
    if (entity == null) {
      entity = new Cover(id);
      entity.contract = getInsuredContract(call.inputs.smartCAdd).id;
      entity.member = call.from.toHex();
      entity.amount = call.inputs.coverDetails.shift();
      entity.daysToCover = call.inputs.coverPeriod;
      entity.created =  call.block.timestamp;
      entity.expires = call.block.timestamp.plus(BigInt.fromI32(entity.daysToCover * 24 * 60 * 60));
      entity.save();
    }
  }
}
