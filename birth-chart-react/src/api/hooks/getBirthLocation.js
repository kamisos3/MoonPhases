import React from "react";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption
} from "@reach/combobox";
import "@reach/combobox/style.css";

export default function LocationSearch({ onSelect }) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions
    } = usePlacesAutocomplete({
        requestOptions: {},
        debounce: 300
    });

    const handleInput = (e) => setValue(e.target.value);
    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            onSelect({ latitude: lat, longitude: lng });
        } catch (err) {
          console.error("Location error:", err);
        }
    };

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput
            value={value}
            onChange{handleInput}
            disabled={!ready}
            placeholder="Select your birth place"
            />
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK" && 
                    data.map(({ place_id, description }) => (
                        <ComboboxOption key={place_id} value={description} />
                    ))}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}