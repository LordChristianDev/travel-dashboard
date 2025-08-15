import { Header, TripCard } from "../../../components";
import { type LoaderFunctionArgs, useSearchParams } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import type { Route } from './+types/trips'
import { useState } from "react";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const limit = 8;
	const url = new URL(request.url);
	const page = parseInt(url.searchParams.get('page') || "1", 10);
	const offset = (page - 1) * limit;

	const [trips] = await Promise.all([
		getAllTrips(limit, offset)
	]);

	return {
		allTrips: trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
			id: $id,
			...parseTripData(tripDetail),
			imageUrls: imageUrls ?? []
		})),
		total: trips.total
	}
}


const Trips = ({ loaderData }: Route.ComponentProps) => {
	const allTrips = loaderData.allTrips as Trip[] | [];

	const [searchParams] = useSearchParams();
	const initialPage = Number(searchParams.get('page') || '1')

	const [currentPage, setCurrentPage] = useState(initialPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.location.search = `?page=${page}`
	}

	const handlePagerClick = (args: { currentPage: number }) => handlePageChange(args.currentPage);

	const renderAllTrips = allTrips.map((trip) => {
		const { id, name, imageUrls, itinerary, interests, travelStyle, estimatedPrice } = trip;

		return (
			<TripCard
				key={id}
				id={id}
				name={name}
				imageUrl={imageUrls[0]}
				location={itinerary?.[0]?.location ?? ""}
				tags={[interests, travelStyle]}
				price={estimatedPrice}
			/>
		);
	})

	return (
		<main className="all-users wrapper">
			<Header
				title="Trips"
				description="View and edit AI-generated travel plans"
				ctaText="Create a trip"
				ctaUrl="/trips/create-trip"
			/>

			<section>
				<h1 className="p-24-semibold text-dark-100 mb-4">
					Manage Created Trips
				</h1>

				<div className="trip-grid mb-4">
					{renderAllTrips}
				</div>

				<PagerComponent
					totalRecordsCount={loaderData.total}
					pageSize={8}
					currentPage={currentPage}
					click={handlePagerClick}
					cssClass="!mb-4"
				/>
			</section>
		</main>
	)
}
export default Trips