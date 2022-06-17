
/**
 * (Get Convo by id)
 * PKEY: id
 * SKEY: TALKING_POINT_POST
 * 
 * 
 * (Get all convos)
 * GSI1: CONVO
 * SKEY: ?
 * 
 * (Get convos by author username, sorted by create date)
 * GSI3: authorUserName
 * SKEY: TALKING_POINT_POST-<createDate>
 * 
 */
export class ConvoRepository {

}

// - Should Convo's be always posted as Talking point posts? Or should they be standalone?
// - Swap sort keys to be POST_<more descriptive identifier> so we can sort between talking points vs other types of posts