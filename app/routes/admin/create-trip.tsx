import { useState } from "react";
import { useNavigate } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import {
	LayerDirective,
	LayersDirective,
	MapsComponent,
} from "@syncfusion/ej2-react-maps";

import { Header } from "components";
import { comboBoxItems, selectItems } from "~/constants";
import { world_map } from "~/constants/world_map";
import type { Route } from "./+types/create-trip";
import { account } from "~/appwrite/client";
import { cn, formatKey } from "~/lib/utils";

export function meta() {
	return [
		{ title: "Create Trip" },
		{ name: "description", content: "Create a Personalized Trip" },
	];
}

export const loader = async () => {
	const fields = 'name,flag,latlng,maps';
	const response = await fetch(`https://restcountries.com/v3.1/all?fields=${fields}`)

	if (!response.ok) {
		console.error('Failed to retrieve countries');
		return [];
	}

	const data = await response.json();
	if (!data) return [];

	const result = data.map((country: any) => ({
		name: (country.flag || '') + ' ' + (country.name?.common || ''),
		coordinates: country.latlng,
		value: country.name?.common,
		openStreepMap: country.maps?.openStreetMap,
	}))

	return result;
}

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
	const navigate = useNavigate();
	const countries = loaderData as Country[];

	const [formData, setFormData] = useState<TripFormData>({
		country: countries[0]?.name || "",
		travelStyle: "",
		interest: "",
		budget: "",
		duration: 0,
		groupType: "",
	});

	const { country, travelStyle, interest, budget, duration, groupType } = formData;

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (key: keyof TripFormData, value: string | number) =>
		setFormData({ ...formData, [key]: value });

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);

		if (
			!country ||
			!travelStyle ||
			!interest ||
			!budget ||
			!groupType
		) {
			setError("Please provide input for all fields");
			setLoading(false);
			return;
		}
		if (duration < 1 || duration > 10) {
			setError("Duration must be between 1 and 10 days");
			setLoading(false);
			return;
		}

		const user = await account.get();
		if (!user.$id) {
			console.error("User not authenticated");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/create-trip", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					country: country,
					numberOfDays: duration,
					travelStyle: travelStyle,
					interests: interest,
					budget: budget,
					groupType: groupType,
					userId: user.$id,
				}),
			});

			const result: CreateTripResponse = await response.json();

			if (result?.id) navigate(`/trips/${result.id}`);
			else console.error("Failed to generate itinerary");
		} catch (error) {
			console.error("Error generating itinerary:", error);
		} finally {
			setLoading(false);
		}
	};

	const mapData = [
		{
			country: country,
			color: "#EA382E",
			coordinates:
				countries.find((c: Country) => c.name === country)
					?.coordinates || [],
		},
	];

	const countryData = countries.map((country) => ({
		text: country.name,
		value: country.value,
	}));

	const handleCountryOnChange = (e: { value: string | undefined }) => {
		if (e.value) {
			handleChange("country", e.value);
		}
	}

	const handleCountryFiltering = (e: { text: string; updateData: (data: any[]) => void }) => {
		const query = e.text.toLowerCase();
		e.updateData(
			countries
				.filter((country) =>
					country.name.toLowerCase().includes(query)
				)
				.map((country) => ({
					text: country.name,
					value: country.value,
				}))
		);
	}

	const handleDurationOnChange = (e: React.ChangeEvent<HTMLInputElement>) => handleChange("duration", Number(e.target.value))

	const renderSelectItems = selectItems.map((key) => {
		const dataSourceItems = comboBoxItems[key].map((item) => ({
			text: item,
			value: item,
		}))

		const handleSelectItemsChange = (e: { value: string | undefined }) => {
			if (e.value) {
				handleChange(key, e.value);
			}
		}

		const handleSelectItemsFiltering = (e: { text: string; updateData: (data: any[]) => void }) => {
			const query = e.text.toLowerCase();
			e.updateData(
				comboBoxItems[key]
					.filter((item) => item.toLowerCase().includes(query))
					.map((item) => ({ text: item, value: item }))
			);
		}

		return (
			<div key={key}>
				<label htmlFor={key}>{formatKey(key)}</label>

				<ComboBoxComponent
					id={key}
					dataSource={dataSourceItems}
					fields={{ text: "text", value: "value" }}
					placeholder={`Select ${key}`}
					change={handleSelectItemsChange}
					allowFiltering={true}
					filtering={handleSelectItemsFiltering}
					className="combo-box"
				/>
			</div>
		);
	})

	return (
		<main className="flex flex-col gap-10 pb-20 wrapper">
			<Header
				title="Add a New Trip"
				description="View and edit AI-generated travel plans"
			/>

			<section className="mt-2.5 wrapper-md">
				<form className="trip-form" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="country">Country</label>
						<ComboBoxComponent
							id="country"
							dataSource={countryData}
							fields={{ text: "text", value: "value" }}
							placeholder="Select a Country"
							change={handleCountryOnChange}
							className="combo-box"
							allowFiltering={true}
							filtering={handleCountryFiltering}
						/>
					</div>

					<div>
						<label htmlFor="duration">Duration</label>
						<input
							id="duration"
							name="duration"
							onChange={handleDurationOnChange}
							placeholder="Enter number of days (e.g., 5, 12)"
							className="form-input placeholder:text-gray-100"
						/>
					</div>

					{renderSelectItems}

					<div>
						<label htmlFor="location">Location on map</label>
						<MapsComponent>
							<LayersDirective>
								<LayerDirective
									shapeData={world_map}
									dataSource={mapData}
									shapePropertyPath="name"
									shapeDataPath="country"
									shapeSettings={{ colorValuePath: "color", fill: "#E5E5E5" }}
								/>
							</LayersDirective>
						</MapsComponent>
					</div>

					<div className="bg-gray-200 h-px w-full" />

					{error && (
						<div className="error">
							<p>{error}</p>
						</div>
					)}

					<footer className="px-6 w-full">
						<ButtonComponent
							type="submit"
							className="button-class !h-12 !w-full"
							disabled={loading}
						>
							<img
								src={`/assets/icons/${loading ? "loader.svg" : "magic-star.svg"}`}
								alt="magic star"
								className={cn("size-5", { "animate-spin": loading })}
							/>
							<span className="p-16-semibold text-white">
								{loading ? "Generating..." : "Generate Itinerary"}
							</span>
						</ButtonComponent>
					</footer>
				</form>
			</section>
		</main>
	);
};

export default CreateTrip;