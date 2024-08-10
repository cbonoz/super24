"use client";

import BasicCard from "@/components/basic-card";
import RenderObject from "@/components/render-object";
import { Button } from "@/components/ui/button";
import { deployContract } from "@/lib/contract/deploy";
import { useEthersSigner } from "@/lib/get-signer";
import { getExplorerUrl, getReadableError, isEmpty } from "@/lib/utils";
import { registerSchema } from '@/util/attest';
import { siteConfig } from "@/util/site-config";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { Chain } from "viem";
import { useChainId, useChains } from "wagmi";

const AdminPage = () => {
	const [result, setResult] = useState<any>();
	const [error, setError] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const chainId = useChainId();
	const chains = useChains();
	const currentChain: Chain | undefined = (chains || []).find((c) => c.id === chainId);

	const signer = useEthersSigner({ chainId });

	async function createSchema() {
		setLoading(true);
		setError(null);

		try {
			// Deploy schema
			const res = await registerSchema(signer, chainId);
			console.log("schema deployed:", res);
			setResult(res);
		} catch (err) {
			console.error("Error deploying schema:", err);
			setError(getReadableError(err));
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex flex-row items-center justify-center mt-8">
			<BasicCard title={`Deploy ${siteConfig.title} schema`}>
				{siteConfig.schemaId && <p>schema id: {siteConfig.schemaId}</p>}
				{!siteConfig.schemaId && <p>schema id not set</p>}

				<div className="text-md my-4">
					Deploy a new schema instance to the {currentChain?.name || ""} blockchain.
				</div>

				<Button onClick={createSchema} disabled={loading}>
					{loading && (
						<span className="animate-spin">
							<ReloadIcon />
						</span>
					)}
					&nbsp; Deploy schema
				</Button>

				{loading && (
					<div className="mt-4 italic">
						Do not leave this page until the transaction is confirmed.
					</div>
				)}

				{error && <div className="text-red-500">{error}</div>}

				{result && (
					<div className="mt-4">
						<RenderObject title="Result" obj={result} />
				</div>)}

							</BasicCard>
		</div>
	);
};

export default AdminPage;
