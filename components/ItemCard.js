import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import EditItem from "../components/EditItem";

function ItemCard({itemBasicUnitsNo, changeEditModal, itemObjId, itemName, itemBrand, indexNo, itemCostBeforeTax, itemCostAfterTax, itemImage, whereBought, itemRetailPrice, itemShares, itemSharesAvailable}) {
    const itemNumber = 1
    const itemNameTest = "Paper Towels"
    const itemBrandTest = "Costco"
    const itemImageTest = "https://i.picsum.photos/id/588/200/300.jpg?hmac=Bb5mvfvSw-sKhocAA4Mfdb78ysl5ktbClTt-Lc0IyWk"

    const [editModal, setEditModal] = useState(false);

    const handleEditModal = async () => {
      changeEditModal(itemObjId)
    }

    return (
        <div className="pt-3 pb-3 flex flex-col item-center">

          {editModal && (
              <div className="relative flex flex-col items-center z-50">
                <div className="pt-2">
                      <EditItem {...itemObjId} />
                </div>
                <div className="pt-2">
                  <button className={styles.connectButton} type="button"
                  onClick={handleEditModal}
                  >
                    Close
                  </button>
                </div>
              </div>
          )}

          <div className="flex flex-col item-center">
            <p className="px-2 block text-gray-700 text-sm font-bold text-white">
              Item Number: {indexNo}
            </p>
          </div>

          <div className="rounded-xl w-[45vw] lg:w-[300px] lg:h-[380px] bg-[#edeef2] flex flex-col items-center shadow-lg lg:shawdow-2xl shadow-slate-300">

            <div className="w-[45vw] lg:w-[300px] lg:h-[380px] rounded-xl flex flex-col item-center relative">
                <div className="flex flex-col items-center bg-white border-4 border-[#edeef2] rounded-xl shadow-inner pl-[15vw] lg:pl-[5vw]">
                  <img layout="responsive" src={itemImage} className="w-[30vw] h-[23vw] lg:w-[292px] lg:h-[160px] object-contain pt-[3px]"/>
                  <p className="text-[12px] md:text-[12px] lg:text-[12px] xl:text-[15px] text-black font-bold absolute top-[20vw] lg:top-[140px] left-[8px] lg:left-[8px] w-[15vw] lg:w-[5vw] ">{itemBrand}</p>
                </div>

                <div className="pl-[7px] flex flex-col items-left">
                  <div className="flex flex-col items-left h-[6.7vw] lg:h-[2.7vw]">
                      <p className="text-[10px] md:text-[10px] lg:text-[12px] xl:text-[15px]">{itemName && itemName}</p>

                  </div>


                    <div className="pt-[15px]">
                        <div className="text-gray-700 text-[8px] lg:text-[12px]">
                          Entire Item Listing Price:
                          <span className="text-black font-bold text-[9px] lg:text-[13px]">{itemRetailPrice && " $" + itemRetailPrice} </span>
                        </div>
                    </div>

                    <div>
                        <div className="text-gray-700 text-[8px] lg:text-[12px]">
                          Price/Unit:
                          <span className="text-black font-bold text-[9px] lg:text-[13px] text-[red]">{(itemRetailPrice/itemBasicUnitsNo).toFixed(2)}</span>
                        </div>
                    </div>


                  <div>
                      <div className="text-gray-700 text-[8px] lg:text-[12px]">
                        Splitting into:
                        <span className="text-[#009dcf] font-bold text-[9px] lg:text-[13px] text-[red]">{ " " + itemShares + " shares"}</span>
                        <div className="text-[#009dcf] text-[8px] lg:text-[11px] pl-[2px]">   ({(itemBasicUnitsNo/itemShares).toFixed(0)} unit(s)/share) </div>
                      </div>
                  </div>

                  <div className="flex flex-col items-start">
                  <div>
                      <div className="text-gray-700 text-[8px] lg:text-[12px]">
                        Price Per Share:
                        <span className="text-black font-bold text-[12px] lg:text-[16px] text-[red]"> ${(itemRetailPrice/itemShares).toFixed(2)} </span>
                      </div>
                  </div>

                  <div className="pb-[35px]">
                      <div className="text-gray-700 text-[8px] lg:text-[12px]">
                        Available share(s):
                        <span className="font-bold text-[12px] lg:text-[16px] text-[#009dcf]"> {itemSharesAvailable}</span>
                      </div>
                  </div>
                  </div>

                  <div className="absolute right-2 bottom-2 md:right-6 md:bottom-6">
                    <button className={styles.connectButton} type="button"
                    onClick={handleEditModal}
                    >
                      Update Item
                    </button>
                  </div>


                </div>



            </div>
          </div>
        </div>
    )
}

export default ItemCard
