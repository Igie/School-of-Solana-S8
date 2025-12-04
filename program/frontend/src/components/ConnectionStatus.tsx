import { CLUSTERS, useWalletContext } from "../context/WalletContext";
import Select from "./ui/Select";

export default function ConnectionStatus() {
    const {
        clusterName,
        setClusterName
    } = useWalletContext();

    return (
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm h-8 px-2 bg-surface border-b border-white/10 text-accent-2">
            {/* Left side: cluster info */}
            <div className="flex items-center gap-x-0.5">
                <Select
                    value={clusterName}
                    onChange={setClusterName}

                    options={
                        CLUSTERS.map((c) => ({
                            label: c.displayName,
                            value: c.name,
                        }))
                    }
                >
                </Select>
            </div>
        </div>
    );
}
