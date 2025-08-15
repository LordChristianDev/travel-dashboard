import type { LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import { cn, getFirstWord, parseTripData } from "~/lib/utils";
import { Header, InfoPill, TripCard } from "../../../components";
import { ChipDirective, ChipListComponent, ChipsDirective } from "@syncfusion/ej2-react-buttons";

import star from "/assets/icons/star.svg";
import calendar from "/assets/icons/calendar.svg";
import location from "/assets/icons/location-mark.svg";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { tripId } = params;
	if (!tripId) throw new Error('Trip ID is required');

	const [trip, trips] = await Promise.all([
		getTripById(tripId),
		getAllTrips(4, 0)
	]);

	return {
		trip,
		allTrips: trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
			id: $id,
			...parseTripData(tripDetail),
			imageUrls: imageUrls ?? []
		}))
	}
}

const TripDetail = ({ loaderData }: { loaderData: Awaited<ReturnType<typeof loader>> }) => {
	if (!loaderData) return null;

	const imageUrls = loaderData.trip?.imageUrls || [];
	const tripData = parseTripData(loaderData.trip?.tripDetail);

	const {
		name, duration, itinerary, travelStyle,
		groupType, budget, interests, estimatedPrice,
		description, bestTimeToVisit, weatherInfo, country
	} = tripData || {};
	const allTrips = loaderData.allTrips as Trip[] | [];

	const pillItems = [
		{ text: travelStyle, bg: '!bg-pink-50 !text-pink-500' },
		{ text: groupType, bg: '!bg-primary-50 !text-primary-500' },
		{ text: budget, bg: '!bg-success-50 !text-success-700' },
		{ text: interests, bg: '!bg-navy-50 !text-navy-500' },
	]

	const visitTimeAndWeatherInfo = [
		{ title: 'Best Time to Visit:', items: bestTimeToVisit },
		{ title: 'Weather:', items: weatherInfo }
	]

	const renderItineraryText = itinerary?.slice(0, 4)
		.map((item) => item.location).join(', ') || ''


	const renderImageUrls = imageUrls.map((url: string, index: number) => {
		return (
			<img
				key={index}
				src={url}
				className={cn('w-full rounded-xl object-cover', index === 0
					? 'md:col-span-2 md:row-span-2 h-[330px]'
					: 'md:row-span-1 h-[150px]')}
			/>
		);
	})

	const renderPillItems = pillItems.map((pill, index) => {
		const { text, bg } = pill;

		return (
			<ChipDirective
				key={index}
				text={getFirstWord(text)}
				cssClass={`${bg} !text-base !font-medium !px-4`}
			/>
		);
	})

	const renderStars = Array(5).fill('null').map((_, index) => {
		return (
			<li key={index}>
				<img
					src={star}
					alt="star"
					className="size-[18px]"
				/>
			</li>
		);
	})

	const renderItinerary = itinerary?.map((dayPlan: DayPlan, index: number) => {
		const { day, location, activities } = dayPlan;

		const renderActivities = activities.map((activity, index: number) => {
			const { time, description } = activity;

			return (
				<li key={index}>
					<span className="flex-shring-0 p-18-semibold">{time}</span>
					<p className="flex-grow">{description}</p>
				</li>
			);
		})

		return (
			<li key={index}>
				<h3>
					Day {day}: {location}
				</h3>

				<ul>
					{renderActivities}
				</ul>
			</li>
		);
	})

	const renderVisitTimeAndWeatherInfo = visitTimeAndWeatherInfo.map((section) => {
		const { title, items } = section;

		const renderItems = items?.map((item) => {
			return (
				<li key={item}>
					<p className="flex-grow">{item}</p>
				</li>
			);
		})

		return (
			<section key={title} className="visit">
				<div>
					<h3>{title}</h3>

					<ul>
						{renderItems}
					</ul>
				</div>
			</section>
		);
	})

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
		<main className="travel-detail wrapper">
			<Header title="Trip Details" description="View and edit AI-generated travel plans" />

			<section className="container wrapper-md">
				<header>
					<h1 className="p-40-semibold text-dark-100">{name}</h1>
					<div className="flex items-center gap-5">
						<InfoPill
							text={`${duration} day plan`}
							image={calendar}
						/>

						<InfoPill
							text={renderItineraryText}
							image={location}
						/>
					</div>
				</header>

				<section className="gallery">
					{renderImageUrls}
				</section>

				<section className="flex gap-3 md:gap-5 items-center flex-wrap">
					<ChipListComponent id="travel-chip">
						<ChipsDirective>
							{renderPillItems}
						</ChipsDirective>
					</ChipListComponent>

					<ul className="flex gap-1 items-center">
						{renderStars}

						<li className="ml-1">
							<ChipListComponent>
								<ChipsDirective>
									<ChipDirective
										text="4.9/5"
										cssClass="!bg-yellow-50 !text-yellow-700"
									/>
								</ChipsDirective>
							</ChipListComponent>
						</li>
					</ul>
				</section>

				<section className="title">
					<article>
						<h3>
							{duration}-Day {country} {travelStyle} Trip
						</h3>
						<p>{budget}, {groupType} and {interests}</p>
					</article>

					<h2>{estimatedPrice}</h2>
				</section>

				<p className="text-sm md:text-lg font-normal text-dark-400">{description}</p>

				<ul className="itinerary">
					{renderItinerary}
				</ul>

				{renderVisitTimeAndWeatherInfo}

			</section>

			<section className="flex flex-col gap-6">
				<h2 className="p-24-semibold text-dark-100">Popular Trips</h2>

				<div className="trip-grid">
					{renderAllTrips}
				</div>
			</section>
		</main>
	)
}

export default TripDetail;