"use client";

import { LynxProfitShare, LynxToken } from "@/data/contracts";
import { readableBigNumber } from "@/utils/big";
import { useImmer } from "use-immer";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import LynxProfitShareABI from "@/data/abi/ProfitShare";
import LynxTokenABI from "@/data/abi/LynxToken";
import { maxUint256, parseEther, zeroAddress } from "viem";
import classNames from "classnames";
import compact from "lodash/compact";
import { useState } from "react";
import { BiSolidChevronLeft, BiSolidChevronRight } from "react-icons/bi";

type SnapshotPaginationsType = Array<
  Array<{
    snapId: bigint;
    qualifier: bigint;
    verification: bigint;
    amount: bigint;
    claimable: boolean;
  }>
>;

const selectedIdsInititalValues = {
  selectedAmount: 0n,
  ids: [],
  qualifierIndexes: [],
  verifierIndexes: [],
};

const DividendCard = () => {
  const [selectedIds, setSelectedIds] = useImmer<{
    ids: bigint[];
    qualifierIndexes: bigint[];
    verifierIndexes: bigint[];
    selectedAmount: bigint;
  }>(selectedIdsInititalValues);

  const [page, setPage] = useState<number>(0);
  const { address } = useAccount();
  const { data: lynxInfo } = useContractReads({
    contracts: [
      {
        address: LynxToken,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address || zeroAddress],
      },
      {
        address: LynxToken,
        abi: LynxTokenABI,
        functionName: "currentSnapId",
      },
    ],
  });

  const { data } = useContractRead({
    address: LynxProfitShare,
    abi: LynxProfitShareABI,
    functionName: "getAllUserParticipatingSnapshots",
    args: [address || zeroAddress],
  });

  const filteredData = compact(
    data?.[0].map((id, index) => {
      if (id === maxUint256) return null;
      return {
        snapId: BigInt(index),
        qualifier: id,
        verification: data?.[0]?.[index] || maxUint256,
        amount: data?.[2]?.[index] || 0n,
        claimable: Boolean(data?.[3]?.[index] || false),
      };
    }) || []
  ).reverse();
  const paginatedData = filteredData.reduce<SnapshotPaginationsType>(
    (acc, current, index) => {
      if (acc.length == 0 || (index + 1) % 10 == 0) acc.push([current]);
      else acc[acc.length - 1].push(current);
      return acc;
    },
    []
  );
  console.log({ lynxInfo, data, selectedIds });

  const { config: claimConfig, error: configError } = usePrepareContractWrite({
    address: LynxProfitShare,
    abi: LynxProfitShareABI,
    functionName: "claimDivs",
    args: [
      selectedIds.ids,
      selectedIds.qualifierIndexes,
      selectedIds.verifierIndexes,
    ],
    enabled: selectedIds.ids.length > 0,
  });
  const {
    write: claimRewards,
    data: claimTxData,
    isLoading: claimTxLoading,
    reset: resetClaim,
  } = useContractWrite({
    ...claimConfig,
    onSuccess: () => {
      setSelectedIds((draft) => {
        draft = selectedIdsInititalValues;
      });
    },
  });
  const { data: claimReceipt, isLoading: isClaiming } = useWaitForTransaction({
    hash: claimTxData?.hash,
    confirmations: 5,
  });

  const claimingLoading = claimTxLoading || isClaiming;

  return (
    <div className="card rounded-3xl border-2 border-primary bg-black/70 px-5 py-4">
      <h4 className="whitespace-pre-wrap pb-4">
        Current LYNX Balance:{"\n"}
        <div className="text-primary block text-center text-xl font-bold pt-2">
          {readableBigNumber(lynxInfo?.[0]?.result || 0n)}&nbsp;
          <span className=" text-xs text-white/90">LYNX</span>
        </div>
      </h4>
      <h3 className="text-xl font-bold text-white/90 pb-4">Rewards</h3>
      <h4 className="whitespace-pre-wrap pb-4">
        To Claim:{"\n"}
        <div className="text-primary block text-center text-xl font-bold pt-2">
          {readableBigNumber(selectedIds.selectedAmount)}&nbsp;
          <span className=" text-xs text-white/90">ETH</span>
        </div>
      </h4>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>LYNX</th>
            <th>Claimable</th>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {paginatedData?.[page]?.map((snapData, index: number) => {
            if (!snapData) return null;
            const { qualifier, verification, snapId, amount, claimable } =
              snapData;
            const indexNum = Number(snapId);

            return (
              <DivRow
                id={qualifier || 0n}
                index={indexNum}
                amount={amount || 0n}
                checked={selectedIds.ids.indexOf(snapId) > -1}
                claimable={
                  // (lynxInfo?.[1]?.result ?? maxUint256)
                  8 > snapId + 1n && claimable
                }
                claimed={!claimable}
                selectId={(claimable) => {
                  console.log("click", snapId);
                  setSelectedIds((draft) => {
                    const idIndex = draft.ids.indexOf(snapId);
                    if (idIndex > -1) {
                      draft.ids.splice(idIndex, 1);
                      draft.qualifierIndexes.splice(idIndex, 1);
                      draft.verifierIndexes.splice(idIndex, 1);
                      draft.selectedAmount -= claimable;
                    } else {
                      draft.ids.push(snapId);
                      draft.qualifierIndexes.push(qualifier);
                      draft.verifierIndexes.push(verification);
                      draft.selectedAmount += claimable;
                    }
                  });
                }}
                key={`snapshot-${index}`}
              />
            );
          })}
        </tbody>
      </table>
      {paginatedData.length > 1 && (
        <div className="flex flex-row justify-between items-center ">
          <button
            className={classNames(
              "btn btn-circle text-primary bg-transparent btn-sm",
              page <= 0 ? "btn-disabled" : ""
            )}
            onClick={() => setPage((p) => p - 1)}
          >
            <BiSolidChevronLeft className="text-xl" />
          </button>
          <div>
            {page + 1}/{paginatedData.length}
          </div>
          <button
            className={classNames(
              "btn btn-circle text-primary bg-transparent btn-sm",
              page + 1 >= paginatedData.length ? "btn-disabled" : ""
            )}
            onClick={() => setPage((p) => p + 1)}
          >
            <BiSolidChevronRight className="text-xl" />
          </button>
        </div>
      )}
      <div className="flex flex-row items-center justify-center pt-4 pb-2">
        <button
          className={classNames(
            "btn btn-sm",
            selectedIds.ids.length > 0 && !claimingLoading
              ? "btn-primary"
              : "btn-disabled"
          )}
          onClick={() => claimRewards?.()}
        >
          {claimingLoading ? (
            <>
              <span className="loading loading-infinity text-primary" />
              Claiming
              <span className="loading loading-infinity text-primary" />
            </>
          ) : (
            "Claim"
          )}
        </button>
      </div>
      {claimTxData?.hash && (
        <a
          className="text-success btn btn-link"
          href={`https://etherscan.io/tx/${claimTxData?.hash}`}
          target="_blank"
          rel="noreferrer"
        >
          Check Receipt
        </a>
      )}
    </div>
  );
};

export default DividendCard;

const DivRow = (props: {
  id: bigint;
  index: number;
  amount: bigint;
  claimable: boolean;
  claimed: Boolean;
  checked: boolean;
  selectId: (amount: bigint) => void;
}) => {
  const { id, index, amount, checked, claimable, selectId, claimed } = props;
  const { data: snapshotInfo } = useContractRead({
    address: LynxProfitShare,
    abi: LynxProfitShareABI,
    functionName: "snapshots",
    args: [BigInt(index)],
  });
  // const snapshotInfo: [
  //   bigint,
  //   bigint,
  //   bigint,
  //   bigint,
  //   bigint,
  //   bigint,
  //   boolean
  // ] = [
  //   1369126860940559166987906n, // Total Tier1
  //   1027756782166990553363769n, // Total Tier2
  //   0n, // tier1 claimed
  //   0n, // tier2 claimed
  //   219117752020n, // tier1 per token
  //   194598569885n, // tier2 per token
  //   false, // full Claim
  // ];
  const claimableAmount =
    amount >= parseEther("50000")
      ? snapshotInfo?.[4] || 0n
      : amount >= parseEther("1000")
      ? snapshotInfo?.[5] || 0n
      : 0n;
  const rewardAmount = (claimableAmount * amount) / parseEther("1");
  return (
    <tr key={`snapshot-${index}`}>
      <td>{index + 1}</td>
      <td>{readableBigNumber(amount || 0n, 0)}</td>
      <td>
        {readableBigNumber(rewardAmount)}
        &nbsp;
        <span className=" text-xs text-white/90">ETH</span>
      </td>
      <td>
        <input
          type="checkbox"
          className={classNames(
            "checkbox",
            claimed
              ? "checkbox-success pointer-events-none"
              : claimable
              ? "checkbox-primary"
              : "hidden"
          )}
          checked={checked || Boolean(claimed)}
          onChange={
            claimed
              ? () => {
                  console.log("false", claimed, index);
                }
              : () => selectId(rewardAmount)
          }
        />
      </td>
    </tr>
  );
};
