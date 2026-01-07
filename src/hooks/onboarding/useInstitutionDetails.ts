import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toaster } from "@/components/ui/toaster";
import { completeStep } from "@/features/onboardingSlice";
import { create as createInstitution } from "@/api/institution";
import { type ApiError } from '@/types/api.types';


import { searchLocation, type GeoapifyFeature } from "@/api/location";

export const useInstitutionDetails = () => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState,
        reset,
        setValue,
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            institutionName: "",
            location: "",
            institutionType: "",
            sizeRange: "",
            licenseNumber: "",
        }
    });

    const { errors, isSubmitting, isValid } = formState;

    const [locationInput, setLocationInput] = useState("");
    const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (locationInput.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                const features = await searchLocation(locationInput);
                setSuggestions(features);
                setShowSuggestions(true);
            } catch (err) {
                console.error("Geoapify fetch error:", err);
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 400);
    }, [locationInput]);

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocationInput(val);
        setValue("location", val, { shouldValidate: true });
    };

    const handleLocationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = suggestions.find(
            (s) => s.properties.formatted === e.target.value
        );
        if (selected) {
            const fullLocation = selected.properties.formatted;
            setLocationInput(fullLocation);
            setValue("location", fullLocation, { shouldValidate: true });
            setShowSuggestions(false);
        }
    };

    const clearLocation = () => {
        setLocationInput("");
        inputRef.current?.focus();
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload = { ...data };
            const response = await createInstitution(payload);
            console.log('Form submitted successfully:', response);
            toaster.create({
                duration: 3000,
                title: "Success",
                description: "Institution details saved successfully.",
                type: "success",
            });
            dispatch(completeStep(2));
            reset();
            setLocationInput("");
            setSuggestions([]);
            setShowSuggestions(false);
        } catch (err) {
            console.error('Form submission failed:', err);
            const apiError = err as ApiError;
            toaster.create({
                title: "Registration Failed",
                description: apiError.response?.data?.message ?? "An error occurred. Please try again.",
                type: "error",
                duration: 5000,
            });
        }
    });

    return {
        register,
        onSubmit,
        reset,
        formState,
        errors,
        isSubmitting,
        isValid,
        locationInput,
        suggestions,
        showSuggestions,
        inputRef,
        handleLocationChange,
        handleLocationSelect,
        clearLocation
    };
};
