import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import { Field } from "@chakra-ui/react";

interface LocationInputProps {
  value: string;
  error?: string;
  onPlaceSelect: (value: string) => void;
  onUserInput: (value: string) => void;
  onBlur?: () => void;
  onChange?: (value: string) => void; // Update onChange to accept a value
}

const LocationInput = ({
  value,
  error,
  onPlaceSelect,
  onUserInput,
  onBlur,
  onChange,
}: LocationInputProps) => {
  return (
    <Field.Root
      //invalid={!!error} // Reflect the error state
      aria-invalid={!!error}
      aria-describedby="location-error"
      onBlur={onBlur}
    >
      <GeoapifyContext apiKey={import.meta.env.VITE_GEOAPIFY_API_KEY}>
        <GeoapifyGeocoderAutocomplete
          type="amenity"
          lang="en"
          limit={10}
          filterByCountryCode={["ng"]}
          biasByCountryCode={["ng"]}
          addDetails
          allowNonVerifiedHouseNumber
          allowNonVerifiedStreet
          debounceDelay={100}
          value={value}
          placeholder="Add the location of your institution"
          placeSelect={(feature) => {
            if (feature?.properties) {
              const { formatted, county } = feature.properties;
              const locationValue =
                county && !formatted.includes(county)
                  ? `${formatted}, ${county}`
                  : formatted;
              onPlaceSelect(locationValue);
              onChange?.(locationValue); // Trigger onChange when a place is selected
              onBlur?.(); // Call onBlur if provided
            }
          }}
          onUserInput={(input) => {
            onUserInput(input);
            onChange?.(input); // Trigger onChange when the user types
          }}
          aria-label="Institution Location"
        />
      </GeoapifyContext>
    </Field.Root>
  );
};

export default LocationInput;
