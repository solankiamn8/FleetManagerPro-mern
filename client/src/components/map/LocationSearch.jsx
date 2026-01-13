import { useState, useEffect } from "react";
import api from "../../api/axios";
import { InformationCircleIcon } from "@heroicons/react/24/outline"


export default function LocationSearch({
    label,
    value,
    onSelect,
    active,
    onFocus,
    onBlur,
    hint,
}) {
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (value?.label) {
            setQuery(value.label);
        }
    }, [value]);

    useEffect(() => {
        if (!active || query.length < 2) {
            setResults([]);
            return;
        }

        const t = setTimeout(() => {
            api.get("/geo/search", { params: { q: query } })
                .then(res => setResults(res.data))
                .catch(() => setResults([]));
        }, 400);

        return () => clearTimeout(t);
    }, [query, active]);

    return (
        <div className="relative z-[1000]">
            <div className="flex items-center gap-1 mb-1">
                <label className="text-xs text-gray-400">{label}</label>

                {hint && (
                    <div className="relative group">
                        <InformationCircleIcon className="w-4 h-4 text-gray-400 hover:text-cyan-300 cursor-pointer" />

                        <div className="
        absolute left-1/2 -translate-x-1/2 top-5 z-50
        hidden group-hover:block
        w-56 rounded-lg bg-[#020617]
        border border-white/10
        px-3 py-2 text-xs text-gray-300 shadow-lg
      ">
                            {hint}
                        </div>
                    </div>
                )}
            </div>

            <input
                className="auth-input"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={onFocus}
                onBlur={() => {
                    setTimeout(onBlur, 150); // allow click selection
                }}
                placeholder={`Search ${label.toLowerCase()}`}
            />


            {active && results.length > 0 && (
                <div className="absolute z-50 w-full bg-[#020617] border border-white/10 rounded mt-1">
                    {results.map(place => (
                        <button
                            key={place.place_id}
                            onClick={() => {
                                onSelect({
                                    lat: +place.lat,
                                    lng: +place.lon,
                                    label: place.display_name,
                                });
                                setQuery(place.display_name);
                                setResults([]);
                            }}
                            className="block w-full text-left px-3 py-2 hover:bg-white/5 text-sm"
                        >
                            {place.display_name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
