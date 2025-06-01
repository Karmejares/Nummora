// hooks/lender/useLenderApproval.ts
import { useState } from "react";
import { approveNumusToken } from "@/contracts/numusToken/approveNumusToken";
import { useBalanceOf } from "@/hooks/Balance/useBalanceOf";
import { useAppDispatch } from "@/store/hooks";

export const useLenderApproval = () => {
  const dispatch = useAppDispatch();
  const { balanceOf } = useBalanceOf();

  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);

    const success = await approveNumusToken(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_NUMMORALOAN!,
      balanceOf.toString(),
      dispatch
    );

    setIsSuccess(success);
    setIsLoading(false);
  };

  return {
    checked,
    setChecked,
    isLoading,
    isSuccess,
    handleApprove,
  };
};
