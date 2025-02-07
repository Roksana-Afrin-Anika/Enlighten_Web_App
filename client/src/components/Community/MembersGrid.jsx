"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch, FiSliders } from "react-icons/fi";
import HighlightedProfiles from "./HighlightedProfiles";
import Link from "next/link";
import { fetchMembers } from "@/features/user/membersSlice";

// Member card to display individual member's data
const MemberCard = ({ member }) => {
  return (
    <Link
      href={`/community/${member._id}`}
      className="bg-white border rounded-lg p-3 flex items-center space-x-4"
    >
      <img
        src={member?.image}
        alt={member?.name}
        className="w-28 h-full rounded-lg object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span
            className={`block w-3 h-3 rounded-full ${
              member.status === "online" ? "bg-green-400" : "bg-red-400"
            }`}
          ></span>
          <h3 className="font-semibold text-lg">{member?.name}</h3>
        </div>
        <p className="text-sm text-gray-600">{member?.description}</p>
        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
          <div className="flex gap-2 items-center">
            <span className="font-medium text-black">SPEAKS:</span>
            {member?.speaks.map((lang, index) => (
              <span key={index} className="ml-1">
                {lang}
              </span>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-medium text-black">LEARNS:</span>
            {member?.learns.map((lang, index) => (
              <span key={index} className="ml-1">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Tabs for different member views
const Tabs = () => {
  const [activeTab, setActiveTab] = useState("All members");

  const tabs = [
    { name: "All members", icon: "🔍" },
    { name: "Near me", icon: "📍" },
    { name: "Travel", icon: "✈️" },
  ];

  return (
    <div className="flex gap-5 py-7">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`flex items-center hover:bg-gray-800 transition-all hover:text-white px-4 py-2 rounded-full ${
            activeTab === tab.name
              ? "bg-gray-800 text-white"
              : "bg-transparent border border-gray-300 text-gray-700"
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.name}
        </button>
      ))}
    </div>
  );
};

// Search bar for filtering members
const SearchBar = ({ searchQuery, onSearch }) => {
  const handleSearch = (e) => {
    onSearch(e.target.value); // Update parent's searchQuery state
  };

  return (
    <div className="flex items-center gap-4 max-w-md">
      <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 flex-grow">
        <FiSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Find members or topics"
          className="bg-transparent outline-none text-gray-700 placeholder-gray-500 flex-grow"
        />
      </div>
      <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
        <FiSliders className="text-gray-500" />
      </button>
    </div>
  );
};

const MembersGrid = () => {
  const dispatch = useDispatch();
  const { members, status, error } = useSelector((state) => state.members);
  const { currentUser } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch members on component mount
  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  // Centralized filtering logic using useMemo
  const filteredMembers = useMemo(() => {
    let filtered = [...members];

    // Filter out the logged-in user
    if (currentUser) {
      filtered = filtered.filter((member) => member._id !== currentUser._id);
    }

    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(lowerQuery) ||
          member.description.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }, [members, currentUser, searchQuery]);

  // Render content based on status
  let content;
  if (status === "loading") {
    content = <p>Loading...</p>;
  } else if (status === "succeeded") {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <MemberCard member={member} key={member._id} />
        ))}
      </div>
    );
  } else if (status === "failed") {
    content = <p>{error}</p>;
  }

  return (
    <div className="p-4 min-h-screen">
      <div className="max-w-[1450px] mx-auto">
        <div className="flex items-center justify-between">
          <Tabs />
          <SearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />
        </div>
        {content}
        <HighlightedProfiles />
      </div>
    </div>
  );
};

export default MembersGrid;
