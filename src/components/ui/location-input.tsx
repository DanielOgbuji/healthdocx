import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from "@geoapify/react-geocoder-autocomplete";
import { Field } from "@chakra-ui/react";

interface LocationInputProps {
  value: string;
  error?: string;
  onPlaceSelect: (value: string) => void;
  onUserInput: (value: string) => void;
}

const LocationInput = ({ value, error, onPlaceSelect, onUserInput }: LocationInputProps) => {
  return (
    <Field.Root invalid={!!error} aria-invalid={!!error} aria-describedby="location-error">
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
              const locationValue = county && !formatted.includes(county)
                ? `${formatted}, ${county}`
                : formatted;
              onPlaceSelect(locationValue);
            }
          }}
          onUserInput={onUserInput}
          aria-label="Institution Location"
        />
      </GeoapifyContext>
    </Field.Root>
  );
};

export default LocationInput;