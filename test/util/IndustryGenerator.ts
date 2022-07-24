// Simple method that can genarate a industry heirarchy from the souce pdf located here:
// Linkedin Industries List v2 April 2022 https://www.linkedin.com/posts/gregcoopers_list-of-microsoft-industry-codes-activity-6915645754866872320-V4VV/
// The Intention is for you to use breakpoints on the objects before the function finishes and grab the values with the debugger.
// I should have a google sheet of this data online.
export const generateIndustries = () => {
    const industries = 'Farming, Ranching, Forestry	\
    Farming, Ranching, Forestry > Farming	\
    Farming, Ranching, Forestry > Farming > Horticulture	\
    Farming, Ranching, Forestry > Ranching and Fisheries	\
    Farming, Ranching, Forestry >  Ranching and Fisheries > Ranching	\
    Farming, Ranching, Forestry > Ranching and Fisheries > Fisheries	\
    Farming, Ranching, Forestry > Forestry and Logging	\
    Oil, Gas, and Mining	\
    Oil, Gas, and Mining > Oil and Gas	\
    Oil, Gas, and Mining > Oil and Gas > Oil Extraction	\
    Oil, Gas, and Mining > Oil and Gas > Natural Gas Extraction	\
    Oil, Gas, and Mining > Mining	\
    Oil, Gas, and Mining > Mining > Coal Mining	\
    Oil, Gas, and Mining > Mining > Metal Ore Mining	\
    Oil, Gas, and Mining > Mining > Nonmetallic Mineral Mining	\
    Utilities	\
    Utilities > Electric Power Transmission, Control, and Distribution	\
    Utilities > Electric Power Generation	\
    Utilities > Electric Power Generation  > Hydroelectric Power Generation	\
    Utilities > Electric Power Generation  > Fossil Fuel Electric Power Generation	\
    Utilities > Electric Power Generation  > Nuclear Electric Power Generation	\
    Utilities > Electric Power Generation  > Solar Electric Power Generation	\
    Utilities > Electric Power Generation  > Wind Electric Power Generation	\
    Utilities > Electric Power Generation  > Geothermal Electric Power Generation	\
    Utilities > Electric Power Generation  > Biomass Electric Power Generation	\
    Utilities > Natural Gas Distribution	\
    Utilities > Water, Waste, Steam, and Air Conditioning Services	\
    Utilities > Water, Waste, Steam, and Air Conditioning Services > Water Supply and Irrigation Systems	\
    Utilities > Water, Waste, Steam, and Air Conditioning Services > Steam  and Air-Conditioning Supply	\
    Utilities > Water, Waste, Steam, and Air Conditioning Services > Waste Collection	\
    Utilities > Water, Waste, Steam, and Air Conditioning Services > Waste Treatment and Disposal	\
    Construction	\
    Construction > Building Construction	\
    Construction > Building Construction > Residential Building Construction	\
    Construction > Building Construction > Nonresidential Building Construction[]	\
    Construction > Civil Engineering	\
    Construction > Civil Engineering > Utility System Construction	\
    Construction > Civil Engineering > Subdivision of Land	\
    Construction > Civil Engineering > Highway, Street, and Bridge Construction	\
    Construction > Specialty Trade Contractors	\
    Construction > Specialty Trade Contractors > Building Structure and Exterior Contractors	\
    Construction > Specialty Trade Contractors > Building Equipment Contractors	\
    Construction > Specialty Trade Contractors > Building Finishing  Contractors	\
    Manufacturing	\
    Manufacturing > Food and Beverage Manufacturing	\
    Manufacturing > Food and Beverage  Manufacturing > Animal Feed Manufacturing	\
    Manufacturing > Food and Beverage Manufacturing > Sugar and Confectionery Product  Manufacturing	\
    Manufacturing > Food and Beverage Manufacturing > Fruit and Vegetable Preserves Manufacturing	\
    Manufacturing > Food and Beverage  Manufacturing > Dairy Product Manufacturing	\
    Manufacturing > Food and Beverage Manufacturing > Meat Products Manufacturing	\
    Manufacturing > Food and Beverage Manufacturing > Seafood Product Manufacturing	\
    Manufacturing > Food and Beverage Manufacturing > Baked Goods Manufacturing	\
    Manufacturing > Food and Beverage Manufacturing > Beverage  Manufacturing	\
    Manufacturing > Food and Beverage  Manufacturing > Wineries	\
    Manufacturing > Food and Beverage Manufacturing > Breweries	\
    Manufacturing > Food and Beverage Manufacturing > Distilleries	\
    Manufacturing > Tobacco Manufacturing	\
    Manufacturing > Textile Manufacturing	\
    Manufacturing > Apparel Manufacturing	\
    Manufacturing > Apparel Manufacturing > Fashion Accessories Manufacturing	\
    Manufacturing > Leather Product Manufacturing	\
    Manufacturing > Leather Product Manufacturing > Footwear  Manufacturing	\
    Manufacturing > Leather Product Manufacturing > Womens Handbag  Manufacturing	\
    Manufacturing > Wood Product Manufacturing	\
    Manufacturing > Paper and Forest  Product Manufacturing	\
    Manufacturing > Printing Services	\
    Manufacturing > Oil and Coal Product Manufacturing	\
    Manufacturing > Chemical Manufacturing	\
    Manufacturing > Chemical Manufacturing > Chemical Raw Materials Manufacturing	\
    Manufacturing > Chemical Manufacturing > Artificial Rubber and Synthetic Fiber Manufacturing	\
    Manufacturing > Chemical Manufacturing > Agricultural Chemical Manufacturing	\
    Manufacturing > Chemical Manufacturing > Pharmaceutical  Manufacturing	\
    Manufacturing > Chemical Manufacturing > Paint, Coating, and Adhesive Manufacturing	\
    Manufacturing > Chemical Manufacturing > Soap and Cleaning Product Manufacturing	\
    Manufacturing > Chemical Manufacturing > Personal Care Product Manufacturing	\
    Manufacturing > Plastics and Rubber Product Manufacturing	\
    Manufacturing > Plastics and Rubber Product Manufacturing > Plastics Manufacturing	\
    Manufacturing > Plastics and Rubber Product Manufacturing > Packaging and Containers  Manufacturing	\
    Manufacturing > Plastics and Rubber Product Manufacturing > Rubber Products Manufacturing	\
    Manufacturing > Glass, Ceramics and Concrete Manufacturing	\
    Manufacturing > Glass, Ceramics and Concrete Manufacturing > Clay and Refractory Products Manufacturing	\
    Manufacturing > Glass, Ceramics and Concrete Manufacturing > Glass  Product Manufacturing	\
    Manufacturing > Glass, Ceramics and Concrete Manufacturing > Lime and Gypsum Products  Manufacturing	\
    Manufacturing > Glass, Ceramics and Concrete Manufacturing > Abrasives and Nonmetallic Minerals  Manufacturing	\
    Manufacturing > Primary Metal Manufacturing	\
    Manufacturing > Fabricated Metal Products	\
    Manufacturing > Fabricated Metal Products > Cutlery and Handtool Manufacturing	\
    Manufacturing > Fabricated Metal Products > Architectural and Structural Metal Manufacturing	\
    Manufacturing > Fabricated Metal Products > Boilers, Tanks, and Shipping Container Manufacturing	\
    Manufacturing > Fabricated Metal Products > Construction Hardware  Manufacturing	\
    Manufacturing > Fabricated Metal Products > Spring and Wire Product Manufacturing	\
    Manufacturing > Fabricated Metal Products > Turned Products and Fastener Manufacturing	\
    Manufacturing > Fabricated Metal Products > Metal Treatments	\
    Manufacturing > Fabricated Metal Products > Metal Valve, Ball, and Roller Manufacturing	\
    Manufacturing > Machinery Manufacturing	\
    Manufacturing > Machinery Manufacturing > Agriculture, Construction, Mining Machinery Manufacturing	\
    Manufacturing > Machinery Manufacturing > Industrial Machinery Manufacturing	\
    Manufacturing > Machinery Manufacturing > Automation Machinery Manufacturing	\
    Manufacturing > Machinery Manufacturing > Commercial and Service Industry Machinery Manufacturing	\
    Manufacturing > Machinery Manufacturing > HVAC and Refrigeration Equipment  Manufacturing	\
    Manufacturing > Machinery Manufacturing > Metalworking Machinery Manufacturing	\
    Manufacturing > Machinery Manufacturing > Engines and Power Transmission Equipment  Manufacturing	\
    Manufacturing > Computers and Electronics Manufacturing	\
    Manufacturing > Computers and Electronics Manufacturing > Computer Hardware Manufacturing	\
    Manufacturing > Computers and Electronics Manufacturing > Communications Equipment  Manufacturing	\
    Manufacturing > Computers and Electronics Manufacturing > Audio and Video Equipment  Manufacturing	\
    Manufacturing > Computers and  Electronics Manufacturing > Semiconductor Manufacturing	\
    Renewable Energy Semiconductor Manufacturing	\
    Manufacturing > Computers and Electronics Manufacturing > Measuring and Control Instrument Manufacturing	\
    Manufacturing > Computers and Electronics Manufacturing > Magnetic and Optical Media Manufacturing	\
    Manufacturing > Appliances, Electrical, and Electronics Manufacturing	\
    Manufacturing > Appliances, Electrical, and Electronics Manufacturing > Electric Lighting Equipment Manufacturing	\
    Transportation, Logistics and Storage	\
    Manufacturing > Appliances, Electrical, and Electronics Manufacturing > Electrical  Equipment Manufacturing	\
    Manufacturing > Transportation  Equipment Manufacturing	\
    Manufacturing > Transportation Equipment Manufacturing > Motor Vehicle Manufacturing	\
    Manufacturing > Transportation Equipment Manufacturing > Motor Vehicle Parts Manufacturing	\
    Manufacturing > Transportation Equipment Manufacturing > Aviation and Aerospace Component Manufacturing	\
    Transportation, Logistics and Storage > Ground Passenger Transportation > Sightseeing Transportation	\
    Manufacturing > Transportation Equipment Manufacturing > Railroad Equipment Manufacturing	\
    Information and Cultural Products > Book and Periodical Publishing	\
    Manufacturing > Furniture and Home Furnishings Manufacturing	\
    Manufacturing > Furniture and Home Furnishings Manufacturing > Household and Institutional Furniture Manufacturing	\
    Manufacturing > Furniture and Home Furnishings Manufacturing > Office Furniture and Fixtures  Manufacturing	\
    Manufacturing > Furniture and Home Furnishings Manufacturing > Mattress and Blinds Manufacturing	\
    Manufacturing > Medical Equipment Manufacturing	\
    Manufacturing > Sporting Goods  Manufacturing	\
    Wholesale	\
    Wholesale > Wholesale Motor Vehicles and Parts	\
    Wholesale > Wholesale Furniture and Home Furnishings	\
    Wholesale > Wholesale Building Materials	\
    Wholesale > Wholesale  Photography Equipment and Supplies	\
    Wholesale > Wholesale Computer  Equipment	\
    Wholesale > Wholesale Metals and Minerals	\
    Wholesale > Wholesale Appliances, Electrical, and Electronics	\
    Wholesale > Wholesale Hardware, Plumbing, Heating Equipment	\
    Wholesale > Wholesale Machinery	\
    Wholesale > Wholesale Recyclable Materials	\
    Wholesale > Wholesale Luxury Goods and Jewelry	\
    Wholesale > Wholesale Paper Products	\
    Wholesale > Wholesale Drugs and Sundries	\
    Wholesale > Wholesale Apparel and Sewing Supplies	\
    Wholesale > Wholesale Footwear	\
    Wholesale > Wholesale Food and Beverage	\
    Information and Cultural Products > Internet Publishing > Online Audio and Video Media > Internet News	\
    Wholesale > Wholesale Chemical and Allied Products	\
    Wholesale > Wholesale Petroleum and Petroleum Products	\
    Wholesale > Wholesale Alcoholic  Beverages	\
    Wholesale > Wholesale Import and Export	\
    Retail	\
    Retail > Retail Motor Vehicles	\
    Retail > Retail Furniture and Home Furnishings	\
    Retail > Retail Appliances, Electrical, and Electronic Equipment	\
    Retail > Food and Beverage Retail	\
    Retail > Food and Beverage Retail > Retail Groceries	\
    Retail > Retail Health and Personal Care Products	\
    Retail > Retail Gasoline	\
    Retail > Retail Apparel and Fashion	\
    Retail > Retail Luxury Goods and Jewelry	\
    Financial Services > Funds and Trusts	\
    Retail > Retail Musical Instruments	\
    Retail > Retail Books and Printed  News	\
    Retail > Retail Florists	\
    Retail > Retail Office Supplies and Gifts	\
    Retail > Retail Office Equipment	\
    Retail > Online and Mail Order Retail	\
    Transportation, Logistics and Storage	\
    Transportation, Logistics and Storage > Airlines and Aviation	\
    Transportation, Logistics and Storage > Rail Transportation	\
    Transportation, Logistics and Storage > Maritime Transportation	\
    Transportation, Logistics and Storage > Truck Transportation	\
    Transportation, Logistics and Storage > Ground Passenger Transportation	\
    Transportation, Logistics and Storage > Ground Passenger Transportation > Urban Transit  Services	\
    Transportation, Logistics and Storage > Ground Passenger Transportation > Interurban and  Rural Bus Services	\
    Transportation, Logistics and Storage > Ground Passenger Transportation > Taxi and Limousine Services	\
    Transportation, Logistics and Storage > Ground Passenger Transportation > School and  Employee Bus Services	\
    Transportation, Logistics and Storage > Ground Passenger Transportation > Shuttles and Special Needs Transportation Services	\
    Transportation, Logistics and Storage > Ground Passenger Transportation > Sightseeing  Transportation	\
    Transportation, Logistics and Storage > Postal Services	\
    Transportation, Logistics and  Storage > Freight and Package Transportation	\
    Transportation, Logistics and Storage > Warehousing and Storage	\
    Information and Cultural Products > Book and Periodical Publishing	\
    Information and Cultural Products > Book and Periodical Publishing > Newspaper Publishing	\
    Information and Cultural Products > Book and Periodical Publishing > Periodical Publishing	\
    Information and Cultural Products > Book and Periodical Publishing > Book Publishing	\
    Information and Cultural Products > Software Development	\
    Information and Cultural Products > Embedded Software Products	\
    Information and Cultural Products > Mobile Computing Software  Products	\
    Information and Cultural Products >  Computer Networking Products	\
    Information and Cultural Products > Computer Games > Mobile Gaming  Apps	\
    Information and Cultural Products >  Data Security Software Products	\
    Information and Cultural Products >  Movie and Video Distribution	\
    Information and Cultural Products >  Movie and Video Distribution > Movies and Sound Recording	\
    Information and Cultural Products >  Movie and Video Distribution > Media Production	\
    Information and Cultural Products > Movie and Video Distribution > Animation and Post-production	\
    Information and Cultural Products > Movie and Video Distribution >  Sound Recording	\
    Information and Cultural Products > Movie and Video Distribution > Sheet Music Publishing	\
    Information and Cultural Products > Internet Marketplace Platforms	\
    Information and Cultural Products > Social Networking Platforms	\
    Information and Cultural Products >  Broadcast Media Production and Distribution	\
    Information and Cultural Products > Broadcast Media Production and Distribution > Radio and Television Broadcasting	\
    Information and Cultural Products > Broadcast Media Production and Distribution > Cable and Satellite Programming	\
    Information and Cultural Products > Telecommunications	\
    Information and Cultural Products > Telecommunications > Telecommunications Carriers	\
    Information and Cultural Products > Telecommunications > Wireless Services	\
    Information and Cultural Products > Telecommunications > Satellite Telecommunications	\
    Information and Cultural Products > Data Infrastructure and Analytics > Business Intelligence Platforms	\
    Information and Cultural Products > Information Services	\
    Information and Cultural Products > Internet Publishing	\
    Information and Cultural Products > Internet Publishing > Online Audio and Video Media	\
    Information and Cultural Products > Internet Publishing > Online Audio and Video Media > Internet News	\
    Information and Cultural Products >  Internet Publishing > Business Content	\
    Financial Services	\
    Financial Services > Credit Intermediation	\
    Financial Services > Credit Intermediation > Banking	\
    Financial Services > Credit Intermediation > Loan Brokers	\
    Financial Services > Credit Intermediation > International Trade and Development	\
    Financial Services > Capital Markets	\
    Education > Technical and Vocational Training > Cosmetology and Barber Schools	\
    Financial Services > Capital Markets  > Securities and Commodity Exchanges	\
    Financial Services > Capital Markets  > Investment Management	\
    Financial Services > Capital Markets  > Venture Capital and Private Equity Principals	\
    Financial Services > Capital Markets  > Investment Advice	\
    Financial Services > Insurance	\
    Financial Services > Insurance > Insurance Carriers	\
    Financial Services > Insurance > Insurance Agencies and Brokerages	\
    Financial Services > Insurance > Claims Adjusting, Actuarial Services	\
    Financial Services > Funds and Trusts	\
    Financial Services > Funds and Trusts > Insurance and Employee Benefit Funds	\
    Financial Services > Funds and Trusts > Pension Funds	\
    Financial Services > Funds and Trusts > Trusts and Estates	\
    Real Estate and Equipment Rental Services	\
    Real Estate and Equipment Rental Services > Leasing Real Estate	\
    Real Estate and Equipment Rental Services > Leasing Real Estate >  Leasing Residential Real Estate	\
    Hospitals and Health Care > Hospitals	\
    Real Estate and Equipment Rental Services > Leasing Real Estate > Leasing Real Estate Agents and  Brokers	\
    Real Estate and Equipment Rental Services > Equipment Rental Services	\
    Real Estate and Equipment Rental Services > Equipment Rental Services > Consumer Goods Rental	\
    Real Estate and Equipment Rental Services > Equipment Rental Services > Commercial and  Industrial Equipment Rental	\
    Professional and Technical Services  > Legal Services	\
    Professional and Technical Services  > Legal Services > Law Practice	\
    Professional and Technical Services  > Legal Services > Alternative Dispute Resolution	\
    Professional and Technical Services  > Architecture and Planning	\
    Professional and Technical Services  > Design Services	\
    Professional and Technical Services  > Design Services > Interior Design	\
    Professional and Technical Services  > Design Services > Graphic Design	\
    Professional and Technical Services  > IT Services and IT Consulting	\
    Entertainment Providers > Museums, Historical Sites, and Zoos > Museums	\
    Professional and Technical Services  > IT Services and IT Consulting > IT System Design Services	\
    Professional and Technical Services  > IT Services and IT Consulting > IT System Operations and Maintenance	\
    Professional and Technical Services  > IT Services and IT Consulting > Computer and Network Security	\
    Professional and Technical Services  > IT Services and IT Consulting > IT System Testing and Evaluation	\
    Professional and Technical Services  > IT Services and IT Consulting > IT System Installation and Disposal	\
    Professional and Technical Services  > Business Consulting and Services > Strategic Management Services	\
    Accomodation Services > Food and Beverage Services	\
    Professional and Technical Services  > Business Consulting and Services > Operations Consulting	\
    Consumer Services > Repair and Maintenance > Footwear and Leather Goods Repair	\
    Professional and Technical Services  > Business Consulting and Services > Environmental Services	\
    Professional and Technical Services  > Research Services	\
    Professional and Technical Services  > Research Services > Nanotechnology Research	\
    Professional and Technical Services  > Research Services > Biotechnology Research	\
    Professional and Technical Services  > Research Services > Think Tanks	\
    Professional and Technical Services  > Marketing Services	\
    Professional and Technical Services  > Marketing Services > Public Relations and Communications Services	\
    Professional and Technical Services  > Marketing Services > Government Relations Services	\
    Professional and Technical Services  > Marketing Services > Market Research	\
    Professional and Technical Services  > Photography	\
    Professional and Technical Services  > Veterinary Services	\
    Holding Companies	\
    Administrative and Support Services	\
    Administrative and Support Services  > Office Administration	\
    Administrative and Support Services  > Facilities Services	\
    Administrative and Support Services  > Facilities Services > Janitorial Services	\
    Administrative and Support Services  > Facilities Services > Landscaping Services	\
    Government Administration > Administration of Justice > Fire Protection	\
    Administrative and Support Services  > Security and Investigations > Security Systems Services	\
    Administrative and Support Services  > Staffing and Recruiting	\
    Government Administration > Environmental Quality Programs	\
    Administrative and Support Services  > Writing and Editing	\
    Administrative and Support Services  > Translation and Localization	\
    Administrative and Support Services  > Telephone Call Centers	\
    Government Administration > Economic Programs > Transportation Programs	\
    Administrative and Support Services  > Fundraising	\
    Administrative and Support Services  > Travel Arrangements	\
    Administrative and Support Services  > Security and Investigations	\
    Technology, Information and Media > Media and Telecommunications	\
    Education	\
    Education > Higher Education	\
    Education > Business Skills Training	\
    Education > Technical and Vocational Training	\
    Education > Technical and  Vocational Training > Secretarial Schools	\
    Education > Technical and Vocational Training > Cosmetology  and Barber Schools	\
    Education > Technical and Vocational Training > Flight Training	\
    Education > Technical and  Vocational Training > Fine Arts Schools	\
    Education > Technical and  Vocational Training > Sports and Recreation Instruction	\
    Education > Technical and  Vocational Training > Language Schools	\
    Education > E-Learning Providers	\
    Hospitals and Health Care	\
    Hospitals and Health Care > Medical Practices	\
    Hospitals and Health Care > Medical Practices > Physicians	\
    Hospitals and Health Care > Medical Practices > Dentists	\
    Hospitals and Health Care > Medical Practices > Chiropractors	\
    Hospitals and Health Care > Medical Practices > Optometrists	\
    Hospitals and Health Care > Medical Practices > Mental Health Care	\
    Hospitals and Health Care > Medical Practices > Physical, Occupational and Speech Therapists	\
    Hospitals and Health Care > Medical Practices > Alternative Medicine	\
    Hospitals and Health Care > Medical Practices > Family Planning Centers	\
    Hospitals and Health Care > Medical Practices > Outpatient Care Centers	\
    Hospitals and Health Care > Medical Practices > Medical and Diagnostic Laboratories	\
    Hospitals and Health Care > Medical Practices > Home Health Care Services	\
    Hospitals and Health Care > Medical Practices > Ambulance Services	\
    Hospitals and Health Care > Nursing and Residential Care Facilities	\
    Hospitals and Health Care > Individual and Family Services	\
    Hospitals and Health Care > Individual and Family Services > Emergency and Relief Services	\
    Hospitals and Health Care > Individual and Family Services > Vocational Rehabilitation Services	\
    Hospitals and Health Care > Individual and Family Services > Child Day Care Services	\
    Hospitals and Health Care > Community Services	\
    Hospitals and Health Care > Community Services > Services for  the Elderly and Disabled	\
    Entertainment Providers	\
    Entertainment Providers > Performing Arts and Spectator  Sports > Dance Companies	\
    Entertainment Providers > Performing Arts and Spectator Sports > Circuses and Magic Shows	\
    Entertainment Providers > Museums, Historical Sites, and Zoos	\
    Entertainment Providers > Museums, Historical Sites, and Zoos  > Museums	\
    Entertainment Providers > Museums, Historical Sites, and Zoos  > Historical Sites	\
    Entertainment Providers > Museums, Historical Sites, and Zoos  > Zoos and Botanical Gardens	\
    Entertainment Providers > Artists and Writers	\
    Entertainment Providers > Musicians	\
    Entertainment Providers > Recreational Facilities > Gambling Facilities and Casinos	\
    Entertainment Providers > Recreational Facilities > Golf Courses and Country Clubs	\
    Entertainment Providers > Recreational Facilities > Wellness and Fitness Services	\
    Accomodation Services > Hospitality	\
    Accomodation Services > Hospitality  > Hotels and Motels	\
    Accomodation Services > Hospitality  > Bed-and-Breakfasts, Hostels, Homestays	\
    Accomodation Services > Food and Beverage Services	\
    Accomodation Services > Food and Beverage Services > Restaurants	\
    Accomodation Services > Food and  Beverage Services > Bars, Taverns, and Nightclubs	\
    Accomodation Services > Food and Beverage Services > Caterers	\
    Accomodation Services > Food and Beverage Services > Mobile Food Services	\
    Consumer Services	\
    Consumer Services > Repair and Maintenance	\
    Consumer Services > Repair and Maintenance > Vehicle Repair and  Maintenance	\
    Consumer Services > Repair and Maintenance > Electronic and Precision Equipment Maintenance	\
    Consumer Services > Repair and Maintenance > Reupholstery and Furniture Repair	\
    Consumer Services > Personal and Laundry Services	\
    Consumer Services > Personal and Laundry Services > Personal Care  Services	\
    Consumer Services > Personal and Laundry Services > Laundry and Drycleaning Services	\
    Consumer Services > Personal and Laundry Services > Pet Services	\
    Consumer Services > Religious Institutions	\
    Consumer Services > Philanthropic Fundraising Services	\
    Consumer Services > Civic and Social Organizations	\
    Consumer Services > Civic and Social Organizations > Political Organizations	\
    Consumer Services > Civic and Social Organizations > Industry Associations	\
    Consumer Services > Civic and Social Organizations > Professional Organizations	\
    Consumer Services > Non-profit Organizations	\
    Consumer Services > Household Services	\
    Government Administration	\
    Government Administration > Public Policy Offices	\
    Government Administration > Public Policy Offices > Executive  Offices	\
    Government Administration >  Public Policy Offices > Legislative Offices	\
    Government Administration > Administration of Justice	\
    Government Administration > Administration of Justice > Courts of  Law	\
    Government Administration > Administration of Justice > Correctional Institutions	\
    Government Administration > Administration of Justice > Fire  Protection	\
    Government Administration > Administration of Justice > Law Enforcement	\
    Government Administration > Administration of Justice > Public Safety	\
    Government Administration >  Health and Human Services	\
    Government Administration > Health and Human Services > Education Administration Programs	\
    Government Administration > Health and Human Services > Public Health	\
    Government Administration > Health and Human Services > Public Assistance Programs	\
    Government Administration >  Environmental Quality Programs	\
    Government Administration > Environmental Quality Programs > Air, Water, and Waste Program Management	\
    Government Administration > Housing and Community  Development	\
    Government Administration > Housing and Community  Development > Housing Programs	\
    Government Administration > Housing and Community Development > Community  Development and Urban Planning	\
    Government Administration >  Economic Programs	\
    Government Administration > Economic Programs > Transportation Programs	\
    Government Administration > Economic Programs > Utilities Administration	\
    Government Administration > Space Research and Technology	\
    Government Administration > Military and International Affairs	\
    Government Administration >  Military and International Affairs > Armed Forces	\
    Government Administration >  Military and International Affairs > International Affairs	\
    Technology, Information and Media	\
    Technology, Information and Media  > Media and Telecommunications	\
    Technology Information and Media  > Technology and Information	\
    Professional Services';

    const industryDescriptions = " This industry includes entities that grow crops, raise  animals, harvest timber, and harvest fish and other animals from a farm, ranch, or their natural habitats.	\
This industry includes entities that grow crops mainly for food and fiber, such as farms, orchards, groves, greenhouses, and nurseries.	\
This industry includes entities that cultivate garden plants, such as fruits, vegetables, flowers, and ornamentals.	\
This industry includes entities that raise or fatten animals and/or raise aquatic plants and aquatic animals in controlled or selected aquatic environments. This includes ranches, farms, and feedlots that keep animals for the  products they produce or for eventual sale.	\
This industry includes entities that raise cattle, milk dairy  cattle, or feed cattle for fattening.	\
This industry includes entities that commercially catch finfish, shellfish, or miscellaneous marine products from a natural habitat, such as bluefish, eels, salmon, tuna, clams, crabs, lobsters, mussels, oysters, shrimp, frogs, sea urchins,  and turtles.	\
This industry includes entities that grow and harvest timber on a long production cycle (i.e., of 10 years or more).	\
This industry includes entities that extract naturally occurring mineral solids, such as coal and ores; liquid minerals, such as crude petroleum; and gases, such as natural gas. Included are entities that provide quarrying, well operations, and other preparation customarily  performed as a part of mining activity.	\
This industry includes entities that operate and/or develop oil and gas field properties. Crude petroleum production, extraction of oil from oil shale and oil sands, production of natural gas, sulfur recovery from natural gas, and recovery  of hydrocarbon liquids are included.	\
This industry includes entities that focus on the exploration, development, and/or the production of petroleum from wells in which the hydrocarbons will initially flow or can be produced using normal or enhanced drilling and extraction techniques or on the production of crude petroleum from surface shales or tar sands or from reservoirs in which the hydrocarbons are semisolids.	\
This industry includes entities that focus on the exploration, development, and/or the production of natural gas from wells in which the hydrocarbons will initially flow or can be produced using normal or enhanced drilling and extraction techniques or the recovery of liquid hydrocarbons from oil and gas field gases.	\
This industry includes entities that mine, develop mine  sites, and prepare metallic minerals and nonmetallic minerals, including coal.	\
This industry includes entities that: 1. Mine bituminous coal, anthracite, and lignite by  underground mining, auger mining, strip mining, culm bank mining, and other surface mining; 2. Develop coal mine sites 3. Beneficiate coal (e.g., clean, wash, screen, and size coal).	\
This industry includes entities that develop mine sites or mine metallic minerals, and those that dress ore or beneficiate (e.g., crush, grind, wash, dry, sinter,  concentrate, calcine, and leach).	\
This industry includes entities that develop mine sites, or mine or quarry nonmetallic minerals (except fuels).  Included are certain well and brine operations, and preparation plants that beneficiate (e.g., crush, grind,  wash, and concentrate) nonmetallic minerals.	\
This industry includes entities that provide electric power, natural gas, steam supply, water supply, and sewage removal. Electric power includes generation, transmission, and distribution; natural gas includes distribution; steam supply includes provision and/or distribution; water supply includes treatment and distribution; and sewage removal includes collection, treatment, and disposal through sewer systems and treatment facilities.	\
This industry includes entities that operate electric power transmission systems; control (i.e., regulate voltages) the transmission of electricity; and/or distribute electricity to distribution centers, other electric utilities, or final  consumers.	\
This industry includes entities that operate electric power generation facilities. These facilities convert other forms of energy, such as water power (i.e., hydroelectric), fossil fuels, nuclear power, and solar power, into electrical energy provided to transmission or electric power  distribution systems.	\
This industry includes entities that operate hydroelectric power generation facilities. These facilities use water power to drive a turbine and produce electric energy provided to transmission or electric power distribution  systems.	\
This industry includes entities that operate fossil-fuel- powered electric power generation facilities. These facilities use fossil fuels (coal, oil, or gas) in internal combustion or combustion-turbine conventional steam processes to produce electric energy provided to  transmission or electric power distribution systems.	\
This industry includes entities that operate nuclear electric power generation facilities. These facilities use nuclear power to produce electric energy provided to transmission  or electric power distribution systems.	\
This industry includes entities that operate solar electric power generation facilities. These facilities use energy from  the sun to produce electric energy.	\
This industry includes entities that operate wind electric power generation facilities to drive turbines and produce electric energy for electric power transmission systems or  for electric power distribution systems.	\
This industry includes entities that operate geothermal electric power generation facilities. These facilities use heat derived from the Earth to produce electric energy provided to transmission or electric power distribution  systems.	\
This industry includes entities that operate biomass electric power generation facilities. These facilities use biomass (wood, waste, alcohol fuels) to produce electric energy provided to transmission or electric power distribution  systems.	\
This industry includes entities that: 1. Operate gas distribution systems (e.g., mains, meters) 2. Buy gas from the well and sell it to a distribution system  (i.e., gas marketers 3. Arrange the sale of gas over gas distribution systems  operated by others (i.e., gas brokers or agents) 4. Transmit and distribute gas to final consumers.	\
This industry includes entities that: 1. Operate water treatment plants and/or water supply  systems 2. Operate sewer systems or sewage treatment facilities 3. Provide steam, heated air, or cooled air.	\
This industry includes entities that operate treatment plants and/or water supply systems. This may include pumping stations, aqueducts, and/or distribution mains,  for water used for drinking, irrigation, or other uses.	\
This industry includes entities that provide steam, heated air, or cooled air. The steam distribution may be through  mains.	\
This industry includes entities that collect and/or haul hazardous waste, nonhazardous waste, and/or recyclable materials within a local area and/or operate hazardous or nonhazardous waste transfer stations and may be responsible for the identification, treatment, packaging, and labeling of waste for the purposes of transport.	\
This industry includes entities that operate waste treatment or disposal facilities (except sewer systems or sewage treatment facilities). Waste combustors or incinerators, solid waste landfills, and compost dumps are  included in this industry; auto wreckers are not.	\
This industry includes entities that construct buildings or  engineer projects (e.g., highways and utility systems) and perform specific activities (e.g., painting and plumbing).	\
This industry includes entities that construct buildings, including temporary buildings and precut, panelized, and prefabricated buildings assembled on-site. New work, additions, alterations, or maintenance and repairs are also  included.	\
This industry includes entities that construct or remodel and renovate single-family and multifamily residential buildings. Included are residential housing general contractors (i.e., new construction, remodeling, or renovating existing residential structures), for-sale builders and remodelers of residential structures, residential project construction management firms, and residential  design-build firms.	\
This industry includes entities that construct nonresidential buildings (including new work, additions, alterations, maintenance, and repairs). This includes the work of nonresidential general contractors, nonresidential for-sale builders, nonresidential design-build firms, and nonresidential project construction management firms.	\
This industry includes entities that conduct engineering projects such as the construction of highways, dams, and  utility systems.	\
This industry includes entities that construct distribution lines and related buildings and structures for utilities (i.e., water, sewer, petroleum, gas, power, and communication). All structures (including buildings) that are integral parts of utility systems (e.g., storage tanks, pumping stations, power plants, and refineries) are included.	\
This industry includes entities that service land and subdivide property into lots for subsequent sale to builders. This may include excavation work for the installation of roads and utility lines. Entities that perform only the legal subdivision of land are not included.	\
This industry includes entities that construct highways (including elevated), streets, roads, airport runways, public sidewalks, or bridges. The work performed may include new work, reconstruction, rehabilitation, and repairs.	\
This industry includes entities that perform specific activities (e.g., pouring concrete, site preparation, plumbing, painting, and electrical work) involved in building construction or similar construction work, but are not responsible for the entire project. This includes new work, additions, alterations, maintenance, and repairs.	\
This industry includes entities that provide specialty trades needed to complete the basic structure (i.e., foundation, frame, and shell) of buildings. This includes new work, additions, alterations, maintenance, and repairs.	\
This industry includes entities that install or service equipment that forms part of a building mechanical system (e.g., electricity, water, heating, and cooling). Contractors installing specialized building equipment, such as elevators, escalators, service station equipment, and central vacuum  cleaning systems are also included.	\
This industry includes entities that provide specialty trades needed to finish buildings. This includes new work,  additions, alterations, maintenance, and repairs.	\
This industry includes entities that use mechanical, physical, or chemical transformation of materials, substances, or components to create new products. Included are entities that assemble component parts of  manufactured products.	\
This industry includes entities that transform livestock and agricultural products into products for intermediate or final consumption, typically sold to wholesalers or retailers for distribution to consumers; retailers of bakery and candy products made on the premises not for immediate  consumption are included.	\
This industry includes entities that manufacture food and  feed for animals from ingredients, such as grains, oilseed mill products, and meat products.	\
This industry includes entities that process agricultural inputs, such as sugarcane, beet, and cacao, to give rise to a new product (sugar or chocolate) and those that begin with  sugar and chocolate and process these further.	\
This industry includes entities that freeze food and use preservation processes such as pickling, canning, and dehydrating. Production processes begin with inputs of  vegetable or animal origin.	\
This industry includes entities that manufacture dairy  products from raw milk, processed milk, and dairy substitutes.	\
This industry includes entities that slaughter animals, prepare processed meats and meat byproducts, and render and/or refine animal fat, bones, and meat scraps. Entities that assembly cut and pack meats (i.e., boxed meats) from  purchased carcasses are included.	\
This industry includes entities that: 1. Can seafood (including soup) 2. Smoke, salt, and dry seafood 3. Eviscerate fresh fish by removing heads, fins, scales,  bones, and entrails 4. Shuck and pack fresh shellfish 5. Process marine fats and oils 6. Freeze seafood. Factory ships that gather and process  seafood into canned seafood products are included.	\
This industry includes entities that: 1. Manufacture fresh and frozen bread and other bakery  products 2. Retail bread and other bakery products not for  immediate consumption made on the premises from flour, not from prepared dough 3. Manufacture cookies, crackers, dry pasta, tortillas, or prepared flour mixes or dough from flour ground  elsewhere.	\
This industry includes entities that manufacture soft drinks and ice; purify and bottle water; and manufacture brewery,  winery, and distillery products.	\
This industry includes entities that focus on one or more of  the following: 1. Growing grapes and manufacturing wines and brandies 2. Manufacturing wines and brandies from grapes and  other fruits grown elsewhere 3. Blending wines and brandies.	\
This industry includes entities that brew beer, ale, lager, malt liquors, and nonalcoholic beer.	\
This industry includes entities that distill potable liquors  (except brandies), distill and blend liquors, and/or blend and mix liquors and other ingredients.	\
This industry includes entities that stem and redry tobacco  and/or manufacture cigarettes and other tobacco products.	\
This industry includes entities that transform a basic fiber (natural or synthetic) into a product, such as yarn or fabric that is further manufactured into usable items, such as sheets, towels, and textile bags for individual or industrial  consumption.	\
This industry includes entities that purchase fabric and cut and sew to make a garment, and those that first knit fabric and then cut and sew to make a garment. This includes apparel contractors that cut or sew on materials owned by others, jobbers who perform entrepreneurial functions in apparel manufacturing, and tailors who manufacture custom garments for individual clients.	\
This industry includes entities that manufacture apparel and accessories (except apparel knitting mills and cut and sew apparel), including jobbers who perform entrepreneurial functions in apparel accessories manufacturing. Example products include belts, caps, gloves (except medical, sporting, safety), hats, and  neckties.	\
This industry includes entities that transform hides into leather by tanning or curing and fabricating the leather into products (except apparel). Included is the manufacture of similar products made from leather substitutes, such as rubber footwear, textile luggage, and plastic wallets.	\
This industry includes entities that manufacture footwear (except orthopedic extension footwear).	\
This industry includes entities that manufacture women's handbags and purses of any material (except precious  metal).	\
This industry includes entities that manufacture wood products, such as lumber, plywood, veneers, wood containers, wood flooring, wood trusses, manufactured homes (i.e., mobile homes), and prefabricated wood  buildings.	\
This industry includes entities that make pulp, paper, or  converted paper products.	\
This industry includes entities that print on apparel and textile products, paper, metal, glass, plastics, and other  materials, except fabric (grey goods).	\
This industry includes entities that transform crude petroleum and coal into usable products, as well as entities that further process refined petroleum and coal products to produce products such as asphalt coatings and  petroleum lubricating oils.	\
This industry includes entities that transform organic and inorganic raw materials by a chemical process and formulate products. It includes the production of basic chemicals as well as intermediate and end products  produced by further processing basic chemicals.	\
This industry includes entities that manufacture chemicals using basic processes, such as thermal cracking and distillation. These chemicals are usually separate chemical elements or separate chemically-defined compounds.	\
This industry includes entities that manufacture synthetic resins, plastics materials, and nonvulcanizable elastomers and mixing and blending resins; synthetic rubber; and cellulosic (e.g., rayon, acetate) and noncellulosic (e.g., nylon, polyolefin, polyester) fibers, including in the form of monofilament, filament yarn, staple, or tow.	\
This industry includes entities that manufacture: 1. Nitrogenous or phosphatic fertilizer materials with or  without mixing with other ingredients into fertilizers 2. Mixing ingredients made elsewhere into fertilizers 3. Fertilizers from sewage or animal waste. Included are entities that formulate and prepare pesticides and other  agricultural chemicals.	\
This industry includes entities that: 1. Manufacture biological and medicinal products 2. Process botanical drugs and herbs 3. Isolate active medicinal principals from botanical drugs  and herbs 4. Manufacture pharmaceutical products intended for internal and external consumption in such forms as ampoules, tablets, capsules, vials, ointments, powders,  solutions, and suspensions.	\
This industry includes entities that mix pigments, solvents, and binders into paints and other coatings, as well as those that manufacture allied paint products, adhesives, glues,  and caulking compounds.	\
This industry includes entities that manufacture and package soaps and other cleaning compounds, surface active agents, and textile and leather finishing agents used  to reduce tension or speed the drying process.	\
This industry includes entities that prepare, blend, compound, and package toiletry preparations, such as perfumes, shaving preparations, hair preparations, face creams, lotions (including sunscreens), and other cosmetic  preparations.	\
This industry includes entities that make goods by  processing plastics materials and raw rubber, generally restricted to products made solely of plastics or rubber.	\
This industry includes entities that process new or spent (i.e., recycled) plastics resins into intermediate or final products, using such processes as compression molding, extrusion molding, injection molding, blow molding, and  casting.	\
This industry includes entities that convert plastics resins into plastics packaging (flexible) film and packaging sheet.	\
This industry includes entities that process natural, synthetic, or reclaimed rubber materials into intermediate or final products using processes, such as vulcanizing, cementing, molding, extruding, and lathe-cutting.	\
This industry includes entities that transform mined or quarried nonmetallic minerals, such as sand, gravel, stone, clay, and refractory materials, into products for  intermediate or final consumption.	\
This industry includes entities that shape, mold, glaze, and fire pottery, ceramics, and plumbing fixtures, and electrical supplies made entirely or partly of clay or other ceramic materials or shape, mold, bake, burn, or harden clay refractories, nonclay refractories, ceramic tile, structural clay tile, brick, and other structural clay building materials.	\
This industry includes entities that manufacture glass and/or glass products by melting silica sand or cullet, or  from purchased glass.	\
This industry includes entities that manufacture lime from calcitic limestone, dolomitic limestone, or other calcareous materials or manufacturing gypsum products.	\
This industry includes entities that manufacture nonmetallic mineral products (except clay products, refractory products, glass products, cement and concrete  products, lime, and gypsum products).	\
This industry includes entities that smelt and/or refine ferrous and nonferrous metals from ore, pig or scrap, using electrometallurgical and other process metallurgical  techniques.	\
This industry includes entities that transform metal into intermediate or end products, or treat metals and metal formed products fabricated elsewhere. This industry does not include machinery, computers and electronics, or metal furniture. This industry includes firearms  manufacturing.	\
This industry includes entities that manufacture one or  more of the following: 1. Metal kitchen cookware (except by casting (e.g., cast iron skillets) or stamped without further fabrication), utensils, and/or nonprecious and precious plated metal  cutlery and flatware 2. Saw blades, all types (including those for power sawing  machines); 3. Nonpowered handtools and edge tools.	\
This industry includes entities that manufacture one or  more of the following: 1. Prefabricated metal buildings, panels and sections 2. Structural metal products 3. Metal plate work products 4. Metal framed windows (i.e., typically using purchased  glass) and metal doors 5. Sheet metal work 6. Ornamental and architectural metal products.	\
This industry includes entities that: 1. Manufacture power boilers and heat exchangers 2. Cut, form, and join heavy gauge metal to manufacture  tanks, vessels, and other containers 3. Form light gauge metal containers.	\
This industry includes entities that manufacture metal hardware, such as metal hinges, metal handles, keys, and  locks (except coin-operated or time locks).	\
This industry includes entities that manufacture steel springs by forming, such as cutting, bending, and heat winding, metal rod or strip stock and/or wire springs and fabricated wire products from wire drawn elsewhere  (except watch and clock springs).	\
This industry includes entities involved in one of the  following: 1. Operating machine shops for machining metal and plastic parts and parts of other composite materials on a  job or order basis 2. Machining precision turned products 3. Manufacturing metal bolts, nuts, screws, rivets, and  other industrial fasteners.	\
This industry includes entities that perform one or more of  the following services for metals and metal products: 1. Heat treating 2. Enameling, lacquering, and varnishing 3. Hot dip galvanizing 4. Engraving, chasing, or etching 5. Powder coating 6. Electroplating, plating, anodizing, coloring, and finishing 7. Other metal surfacing services.	\
This industry includes entities that manufacture fabricated metal products like valves, balls, and rollers (except forgings and stampings, cutlery and handtools, architectural and structural metals, boilers, tanks, shipping containers, hardware, spring and wire products, machine shop products, turned products, screws, and nuts and  bolts).	\
This industry includes entities that create end products  that apply mechanical force, for example, the application of gears and levers, to perform work.	\
This industry includes entities that manufacture one or  more of the following: 1. Farm machinery and equipment, power mowing  equipment, and other powered home lawn and garden equipment 2. Construction machinery, surface mining machinery, and  logging equipment 3. Oil and gas field and underground mining machinery and  equipment.	\
This industry includes entities that manufacture industrial machinery, such as food and beverage manufacturing machinery, semiconductor manufacturing machinery, sawmill and woodworking machinery (except handheld), machinery for making paper and paper products, printing and binding machinery and equipment, textile making machinery, and machinery for making plastics and rubber  products.	\
This industry includes entities that use control systems for machinery, processes in factories, and human-machine interfaces with minimal or reduced human intervention. Control systems can be discrete, sequential, or computerized, and range in complexity from household temperature control to large industrial systems with multi- variable high-level algorithms. Artificial neural networks, motion control, and robotics are included.	\
This industry includes entities that manufacture commercial and service industry machinery, such as optical instruments, photographic and photocopying equipment, automatic vending machinery, commercial laundry and drycleaning machinery, office machinery, automotive maintenance equipment (except mechanics’ handtools),  and commercial-type cooking equipment.	\
This industry includes entities that manufacture ventilating, heating, air-conditioning, and commercial or industrial refrigeration and freezer equipment.	\
This industry includes entities that manufacture metalworking machinery, such as metal cutting and metal forming machine tools; cutting tools; accessories for metalworking machinery; special dies, tools, jigs, and fixtures; industrial molds; rolling mill machinery; assembly machinery; coil handling, conversion, or straightening equipment; and wire drawing and fabricating machines.	\
This industry includes entities that manufacture turbines, power transmission equipment, and internal combustion engines (except automotive, gasoline and aircraft).	\
This industry includes entities that manufacture computers, computer peripherals, communications equipment, and similar electronic products, and entities  that manufacture components for such products.	\
This industry includes entities that manufacture or assemble electronic computers, such as mainframes, personal computers, workstations, laptops, and computer servers; and computer peripheral equipment, such as storage devices, printers, monitors, and input/output  devices and terminals.	\
This industry includes entities that manufacture communications equipment such as wire telephone and data communications equipment, and radio or television  broadcast and wireless communications equipment.	\
This industry includes entities that manufacture electronic audio and video equipment for home entertainment, motor vehicles, and public address and musical instrument  amplification.	\
This industry includes entities that manufacture  semiconductors and other components for electronic applications.	\
This industry includes entities that manufacture semiconductors and other components for use in photovoltaic cells and other renewable energy  applications.	\
This industry includes entities that manufacture navigational, measuring, electromedical, and control instruments. Examples of products made by these entities are aeronautical instruments, appliance regulators and controls (except switches), laboratory analytical instruments, navigation and guidance systems, and  physical properties testing equipment.	\
This industry includes entities that manufacture optical and magnetic media, such as blank audio tapes, blank video tapes, and blank diskettes, and/or mass duplicate (i.e., making copies) audio, video, software, and other data on  magnetic, optical, and similar media.	\
This industry includes entities that manufacture products that generate, distribute, and use electrical power, including small and major electrical appliances and parts; electric motors; devices for storing electrical power (e.g., batteries); for transmitting electricity (e.g., insulated wire); and wiring devices (e.g., electrical outlets, fuse boxes, and  light switches).	\
This industry includes entities that manufacture 1. Electric light bulbs and tubes, and parts and components (except glass blanks for electric light bulbs) or 2. Electric lighting fixtures (except vehicular), nonelectric lighting equipment, lamp shades (except glass and plastics), and lighting fixture components (except current-carrying  wiring devices).	\
This industry includes entities that manufacture small electric appliances, electric housewares, and major household appliances.	\
This industry includes entities that manufacture power, distribution, and specialty transformers; electric motors, generators, and motor generator sets; switchgear and  switchboard apparatus; relays; and industrial controls.	\
This industry includes entities that manufacture equipment  for transporting people and goods.	\
This industry includes entities that manufacture complete automobiles, light duty motor vehicles, and heavy duty trucks (i.e., body and chassis or unibody) or manufacture  motor vehicle chassis only.	\
This industry includes entities that manufacture motor vehicle gasoline engines and engine parts, motor vehicle electrical and electronic equipment, motor vehicle steering and suspension components (except springs), motor vehicle brake systems, motor vehicle transmission and power train parts, motor vehicle seating and interior trim, motor vehicle metal stampings, and other motor vehicle  parts and accessories.	\
This industry includes entities that: 1. Manufacture complete aircraft, missiles, or space  vehicles 2. Manufacture aerospace engines, propulsion units,  auxiliary equipment or parts 3. Develop and make prototypes of aerospace products 4. Make major modifications to aircraft systems 5. Overhaul and rebuild complete aircraft or propulsion  systems.	\
This industry includes entities that manufacture complete guided missiles and space vehicles and/or develop  prototypes.	\
This industry includes entities that: 1. Manufacture and/or rebuild locomotives, locomotive  frames and parts 1. Manufacture railroad, street, and rapid transit cars and  car equipment for freight and passenger rail service 3. Manufacture rail layers, ballast distributors, rail tamping equipment and other railway track maintenance  equipment.	\
This industry includes entities that operate shipyards or boatyards (i.e., ship or boat manufacturing facilities).  Activities include the construction of ships, their repair, conversion and alteration, production of prefabricated ship and barge sections, and specialized services such as ship  scaling.	\
This industry includes entities that make furniture and related articles, such as mattresses, window blinds, cabinets, and fixtures. Design may be performed by the entity’s workforce or may be purchased from industrial  designers.	\
This industry includes entities that manufacture household- type furniture, such as living room, kitchen and bedroom furniture and institutional (i.e., public building) furniture, such as furniture for schools, theaters, and churches.	\
This industry includes entities that manufacture office furniture and/or office and store fixtures on a stock or custom basis that may be assembled or unassembled (i.e.,  knockdown).	\
This industry includes entities that manufacture furniture related products, such as mattresses, blinds, and shades.	\
This industry includes entities that manufacture medical equipment and supplies. Example products include surgical and medical instruments, surgical appliances and supplies, dental equipment and supplies, orthodontic goods, ophthalmic goods, dentures, and orthodontic appliances.	\
This industry includes entities that manufacture sporting  and athletic goods (except apparel and footwear).	\
This industry includes entities that distribute wholesale merchandise, generally without transformation, and render services incidental to the sale of merchandise. Merchandise includes the outputs of agriculture, mining, manufacturing, and certain information industries, such as  publishing.	\
This industry includes entities that distribute wholesale automobiles and other motor vehicles, motor vehicle  supplies, tires, and new or used parts.	\
This industry includes entities that distribute wholesale furniture (except hospital beds, medical furniture, and  drafting tables), home furnishings, and/or housewares.	\
This industry includes entities that distribute wholesale building materials, such as lumber, plywood, millwork, and wood panels; brick, stone, and related construction materials; roofing, siding, and insulation materials; and other construction materials, including manufactured homes (i.e., mobile homes) and/or prefabricated buildings.	\
This industry includes entities that distribute wholesale  photographic equipment and supplies (except office equipment).	\
This industry includes entities that distribute wholesale  computers and computer equipment.	\
This industry includes entities that distribute wholesale products of the primary metals industries (including metal service centers) and coal, coke, metal ores, and/or nonmetallic minerals (except precious and semiprecious  stones and minerals used in construction).	\
This industry includes entities that distribute wholesale electrical apparatus and equipment, wiring supplies, and related equipment; household appliances, electric housewares, and consumer electronics; and other  electronic parts and equipment.	\
This industry includes entities that distribute wholesale hardware; plumbing and heating equipment and supplies (hydronics); warm air heating and air-conditioning equipment and supplies; and refrigeration equipment and  supplies.	\
This industry includes entities that distribute wholesale construction, mining, farm, garden, industrial, service establishment, and transportation machinery, equipment,  and supplies.	\
This industry includes entities that distribute wholesale automotive scrap, industrial scrap, and other recyclable materials. Included in this industry are auto wreckers that dismantle motor vehicles for the purpose of wholesaling  scrap.	\
This industry includes entities that distribute wholesale jewelry, precious and semiprecious stones, precious metals and metal flatware, costume jewelry, watches, clocks,  silverware, and/or jewelers' findings.	\
This industry includes entities that distribute wholesale bulk printing and writing paper; stationery and office  supplies; and industrial and personal service paper.	\
This industry includes entities that distribute wholesale biological and medical products; botanical drugs and herbs; and pharmaceutical products intended for internal and/or external consumption in such forms as ampoules, tablets, capsules, vials, ointments, powders, solutions, and  suspensions.	\
This industry includes entities that distribute wholesale piece goods, notions, and other dry goods; men's and boys' clothing and furnishings; women's, children's, and infants'  clothing and accessories; and footwear.	\
This industry includes entities that distribute wholesale footwear (including athletic footwear) of leather, rubber,  and other materials.	\
This industry includes entities that distribute wholesale: 1. General line of groceries 2. Packaged frozen food 3. Dairy products 4. Poultry and poultry products 5. Confectioneries 6. Fish and seafood 7. Meats and meat products 8. Fresh fruits and vegetables 9. Other grocery and related products.	\
This industry includes entities that distribute wholesale agricultural products (except raw milk, live poultry, and fresh fruits and vegetables), such as grains, field beans, livestock, and other farm product raw materials (excluding  seeds).	\
This industry includes entities that distribute wholesale chemicals, plastics materials and basic forms and shapes,  and allied products.	\
This industry includes entities that distribute wholesale petroleum and petroleum products, including liquefied  petroleum gas.	\
This industry includes entities that distribute wholesale  beer, ale, wine, and/or distilled alcoholic beverages.	\
This industry includes entities that facilitate trade of goods and commodities between domestic and foreign companies. Entities may buy/sell goods on their own account (import/export merchants) or on a commission basis (import/export agents and brokers). Subject to trade agreements between jurisdictions, they may handle tariffs  and customs declarations and procedures.	\
This industry includes entities that retail merchandise generally in small quantities to the general public and provide services incidental to the sale of the merchandise.	\
This industry includes entities that primarily retail motor vehicles and parts from fixed point-of-sale locations and also provide repair and maintenance services for the  vehicles.	\
This industry includes entities that primarily retail new furniture and home furnishings from fixed point-of-sale locations and many offer interior decorating services in  addition to the sale of products.	\
This industry includes entities that primarily retail new electronics and appliances, including heating and refrigeration appliances, from point-of-sale locations and may also offer maintenance and repair of the electronic  equipment and appliances.	\
This industry includes entities that primarily retail food and/or beverage merchandise from fixed point-of-sale locations and guarantee the proper storage and sanitary  conditions required by regulatory authority.	\
This industry includes entities that retail a general line of food, such as canned and frozen foods; fresh fruits and vegetables; and fresh and prepared meats, fish, and poultry. Examples include grocery stores, supermarkets,  and delicatessens.	\
This industry includes entities that primarily retail health and personal care merchandise from fixed point-of-sale locations and may offer services related to retailing, advising customers, and/or fitting the product sold to the  customer's needs.	\
This industry includes entities that primarily retail automotive fuels (e.g., gasoline, diesel fuel, gasohol, alternative fuels) and automotive oils or retail these  products in combination with convenience store items.	\
This industry includes entities that retail new clothing and clothing accessories from fixed point-of-sale locations.	\
This industry includes entities that retail one or more of  the following items: 1. New jewelry (except costume jewelry) 2. New sterling and plated silverware 3. New watches and clocks. Also included are entities retailing these new products in combination with lapidary  work and/or repair services.	\
This industry includes entities that retail art materials and  supplies.	\
This industry includes entities that primarily retail new musical instruments, sheet music, and related supplies; or retailing these new products in combination with services like musical instrument repair, rental, or music instruction.	\
This industry includes entities that primarily retail new  books, newspapers, magazines, and other periodicals.	\
This industry includes entities that primarily retail cut flowers, floral arrangements, and potted plants purchased  from others.	\
This industry includes entities that primarily retail new  office supplies, stationery, gifts, novelty merchandise, and souvenirs.	\
This industry includes entities that retail office equipment,  such as printers, copiers, and other general office machinery.	\
This industry includes entities that create and operate online-only and/or mail-order based marketplaces for the sale of goods. This industry includes entities that retail all types of merchandise using nonstore means, such as catalogs, toll free telephone numbers, interactive  television, or the Internet.	\
This industry includes entities that store and warehouse goods, transport passengers and cargo, provide scenic and sightseeing transportation, and provide support activities  related to modes of transportation.	\
This industry includes entities that provide air transportation of passengers and/or cargo using aircraft, such as airplanes and helicopters. Included are scheduled air transportation and nonscheduled, i.e. chartered air transportation of passengers, cargo, or specialty flying  services.	\
This industry includes entities that primarily provide rail transportation of passengers and/or cargo using railroad rolling stock that operate on networks, with physical facilities, labor force, and equipment spread over an extensive geographic area, or operate over a short distance  on a local rail line.	\
This industry includes entities that transport passengers and cargo using watercraft, such as ships, barges, and boats. This includes deep sea, coastal, and inland water  transportation.	\
This industry includes entities that provide over-the-road transportation of cargo using motor vehicles, such as trucks and tractor trailers. This includes general freight trucking (i.e., palletized commodities transported in a container or van trailer) and specialized freight trucking (i.e., transportation of cargo that, because of size, weight, or shape, requires specialized transportation equipment).	\
This industry includes entities that primarily provide a variety of ground passenger transportation services, such as urban transit systems; chartered bus, school bus, and  interurban bus transportation; and taxis.	\
This industry includes entities that primarily operate local and suburban passenger transit systems over regular routes and on regular schedules within a metropolitan  area.	\
This industry includes entities that primarily provide bus passenger transportation over regular routes and on regular schedules, principally outside a single metropolitan  area.	\
This industry includes entities that primarily provide passenger transportation by automobile or van or providing an array of specialty and luxury passenger transportation services via limousine or luxury sedan generally on a reserved basis, and do not operate over  regular routes and on regular schedules.	\
This industry includes entities that primarily provide buses and other motor vehicles to transport pupils to and from school or employees to and from work.	\
This industry includes entities that primarily provide other transit and ground passenger transportation (except urban transit systems, interurban and rural bus transportation, taxi services, school and employee bus transportation, charter bus services, and limousine services (except shuttle services)), including shuttle services (except employee bus) and special needs transportation services.	\
This industry includes entities that primarily use transportation equipment to provide recreation and entertainment.	\
This industry includes government entities that provide mail services under a universal service obligation, including the carriage of letters, printed matter, or mailable packages, including acceptance, collection, processing, and  delivery.	\
This industry includes entities that primarily provide a  variety of transportation services for freight, packages, and mail.	\
This industry includes entities that operate warehouse and storage facilities for general merchandise, refrigerated goods, and other warehouse products. They take responsibility for keeping goods secure and do not sell the goods they handle, but may provide services related to the distribution of goods, such as labeling, inventory control,  and light assembly.	\
This industry includes entities that publish newspapers, magazines, other periodicals, and books, as well as  directories and mailing lists.	\
This industry includes entities known as newspaper publishers. Entities in this industry produce and distribute newspapers (i.e., gather news; write news columns, feature stories, and editorials; and sell and prepare advertisements). These entities may publish newspapers in  print or electronic form.	\
This industry includes entities known either as magazine or periodical publishers that carry out the operations necessary for producing and distributing magazines and other periodicals, such as gathering, writing, and editing articles, and selling and preparing advertisements and may publish magazines and other periodicals in print or  electronic form.	\
This industry includes entities known as book publishers that carry out design, editing, and marketing activities necessary for producing and distributing books, in print,  electronic, or audio form.	\
This industry includes entities that publish computer software and carry out operations necessary for production and distribution, such as design, documentation, installation, and support services. They may design, develop, and publish, or publish only; they may publish and distribute remotely through subscriptions  and downloads.	\
This industry includes entities that produce software (or 'firmware') for machines or devices that are not usually thought of as computers, ex: routers, refrigerators, display systems, washing machines, etc. i.e., software for the internet of things but do not produce these devices.	\
This industry includes entities that produce software which runs on mobile computing devices such as smartphones  and tablet computers.	\
This industry includes entities that produce software that  manages or runs on collections of connected computers.	\
This industry includes entities that produce user-facing software for gaming on mobile platforms.	\
This industry includes entities that produce software to  ensure security of data and computing systems.	\
This industry includes entities that primarily distribute  movies and videos.	\
This industry includes entities that primarily produce and distribute movies and sound recordings.	\
This industry includes entities that produce multimedia  content. Entities in this industry do not distribute or broadcast this content themselves.	\
This industry includes entities that provide specialized motion picture or video postproduction services, such as editing, film/tape transfers, subtitling, credits, closed  captioning, and animation and special effects.	\
This industry includes entities that primarily produce and distribute musical recordings, publish music, or provide  sound recording and related services.	\
This industry includes entities that primarily acquire and register copyrights for musical compositions in accordance with law and promoting and authorizing the use of these compositions in recordings, radio, television, motion pictures, live performances, print, or other media.	\
This industry includes entities that provide a web-based platform for the buying and selling of goods owned by others, or as a marketplace that creates a trading opportunity between two entities or parties (e.g., matching platforms), generally on a fee or commission basis.	\
This industry includes entities that provide services and infrastructure for social networking, primarily over the  internet.	\
This industry includes entities that create or license radio or television content as well as distribute or broadcast it.	\
This industry includes entities that operate broadcast studios and facilities for over-the-air or satellite delivery of radio and television programs and often generate revenues from the sale of air time to advertisers, from donations and  subsidies, or from the sale of programs.	\
This industry includes entities that operate studios and facilities for the broadcasting of programs on a subscription or fee basis which are usually delivered to a third party, such as cable systems or direct-to-home satellite systems,  for transmission to viewers.	\
This industry includes entities that provide telecommunications and related services (e.g., telephony, including Voice over Internet Protocol (VoIP); cable and satellite television distribution services; Internet access; and telecommunications reselling services). They operate and/or provide access to facilities for the transmission of voice, data, text, sound, and video.	\
This industry includes entities that operate, maintain, and/or provide access to switching and transmission facilities and infrastructure that they own and/or lease for the transmission of voice, data, text, sound, and video using wired and wireless telecommunications networks.	\
This industry includes entities that operate and maintain switching and transmission facilities to provide communications via the airwaves, such as cellular phone services, paging services, wireless Internet access, and  wireless video services.	\
This industry includes entities that provide telecommunications services to other entities in the telecommunications and broadcasting industries by forwarding and receiving communications signals via a system of satellites or reselling satellite  telecommunications.	\
This industry includes entities that provide content, data, services, and/or computer hardware for gathering or distributing information specifically about markets and  business activities.	\
This industry includes entities that supply information, store and provide access to information, search and retrieve information, or operate Web sites that use search engines to allow for Internet search. Examples are libraries,  archives, and Web search portals.	\
This industry includes entities that publish and/or broadcast content on the Internet exclusively. They do not provide traditional (non-Internet) versions of the content  they publish or broadcast.	\
This industry includes entities that publish and/or broadcast content on the Internet exclusively. These entities publish in audio and video content primarily, and  do not publish news, business content, blogs or vlogs.	\
This industry includes entities that publish and/or broadcast news content on the Internet exclusively or operate Web sites that use a search engine to generate and maintain extensive databases of news in an easily searchable format, and do not provide traditional (non- Internet) versions of the content that they publish or  broadcast.	\
This industry includes entities that provide news and content about markets and business activities.	\
This industry includes entities that make financial transactions (creation, liquidation, or change in ownership of financial assets) and/or that facilitate financial  transactions.	\
This industry includes entities that primarily lend funds raised from depositors or from credit market borrowing; or facilitate the lending of funds or issuance of credit by engaging in such activities as mortgage and loan brokerage, clearinghouse and reserve services, and check cashing  services.	\
This industry includes entities that accept demand and other deposits and make commercial, industrial, and consumer loans. Commercial banks and branches of  foreign banks are included.	\
This industry includes entities that primarily arrange loans by bringing borrowers and lenders together on a  commission or fee basis.	\
This industry includes entities that provide working capital funds to exporters; lend funds to foreign buyers of goods; or lend funds to domestic buyers of imported goods.	\
This industry includes entities that: 1. Underwrite securities issues and/or make markets for  securities and commodities 2. Act as brokers between buyers and sellers of securities  and commodities 3. Provide securities and commodity exchange services 4. Manage portfolios of assets, provide investment advice, and provide and trust, fiduciary, and custody services.	\
This industry includes entities that underwrite, originate, and/or maintain markets for issues of securities, and entities that act as principals in buying or selling securities on a spread basis, such as securities dealers or stock option  dealers.	\
This industry includes entities that furnish physical or electronic marketplaces to facilitate the buying and selling of stocks, stock options, bonds, or commodity contracts.	\
This industry includes entities that act as principals or brokers in buying or selling financial contracts (except investment bankers and securities and commodity contracts dealers and brokerages). Also included are investment services (except securities and commodity exchanges) such as portfolio management, investment  advice, and trust, fiduciary, and custody services.	\
This industry includes entities that act as principals (except investment bankers, securities dealers, and commodity contracts dealers) in buying or selling financial contracts  generally on a spread basis.	\
This industry includes entities that provide customized  investment advice to clients on a fee basis, but do not have the authority to execute trades.	\
This industry includes entities that underwrite annuities and insurance policies or sell insurance policies and provide other insurance and employee-benefit-related services.	\
This industry includes entities that primarily provide underwriting (assuming the risk, assigning premiums, and so forth) annuities and insurance policies and investing premiums to build up a portfolio of financial assets to be  used against future claims.	\
This industry includes entities that primarily act as agents (i.e., brokers) in selling annuities and insurance policies.	\
This industry includes entities that primarily provide services related to insurance (except insurance agencies  and brokerages).	\
This industry includes legal entities (i.e., funds, plans, and/or programs) organized to pool securities or other assets on behalf of shareholders or beneficiaries of employee benefit or other trust funds to earn interest,  dividends, and other investment income.	\
This industry includes legal entities (i.e., funds, plans, and/or programs) organized to provide insurance and employee benefits exclusively for the sponsor, firm, or its  employees or members.	\
This industry includes legal entities (i.e., funds, plans, and/or programs) organized to provide retirement income benefits exclusively for the sponsor's employees or  members.	\
This industry includes legal entities (i.e., investment pools and/or funds) organized to pool securities or other assets (except insurance and employee benefit funds) on behalf  of shareholders, unitholders, or beneficiaries.	\
This industry includes entities that rent, lease, or otherwise allow the use of tangible or intangible assets, and entities providing related services such as managing real estate for others, selling, renting and/or buying real estate for others,  and appraising real estate.	\
This industry includes entities that rent or lease real estate to others; manage, sell, buy, or rent real estate for others; and provide other services related to real estate, such as appraisals. Equity real estate investment trusts (REITs) that lease buildings, dwellings, or other real estate property to others are included. Property development organizations  are included in this industry.	\
This industry includes entities that primarily act as lessors  of 1. Residential buildings and dwellings 2. Nonresidential buildings (except miniwarehouses) 3. Miniwarehouses and self-storage units 4. Other real estate property.	\
This industry includes entities that act as lessors of buildings (except miniwarehouses and self-storage units) that are not used as residences or dwellings.	\
This industry includes entities that primarily act as agents and/or brokers in selling real estate for others; buying real estate for others; and/or renting real estate for others.	\
This industry includes entities that provide a wide array of tangible goods, such as automobiles, computers, consumer goods, and industrial machinery and equipment, to customers in return for a periodic rental or lease payment.	\
This industry includes entities that rent personal and household-type goods, generally short-term rental although in some instances, the goods may be leased for  longer periods of time.	\
This industry includes entities that rent or lease commercial-type and industrial-type machinery and equipment -- capital or investment-type equipment that  clients use in their business operations.	\
This industry includes entities that offer legal services, such as those offered by offices of lawyers, offices of notaries, title abstract and settlement offices, and paralegal services.	\
This industry includes offices of lawyers or attorneys (i.e., counselors-at-law) that provide expertise in a range or in specific areas of law, such as criminal law, corporate law, family and estate law, patent law, real estate law, or tax  law.	\
This industry includes entities (except offices of lawyers,  attorneys, and paralegals) that provide arbitration and conciliation services.	\
This industry includes entities that plan and design residential, institutional, leisure, commercial, and industrial buildings and structures by applying knowledge of design, construction procedures, zoning regulations, building  codes, and building materials.	\
This industry includes entities that provide specialized design services (except architectural, engineering, and  computer systems design).	\
This industry includes entities that plan, design, and administer projects in interior spaces to meet the physical and aesthetic needs of people using them, taking into consideration building codes, health and safety regulations, traffic patterns and floor planning, mechanical and electrical needs, and interior fittings and furniture.	\
This industry includes entities that plan, design, and manage the production of visual communication to convey specific messages or concepts, clarify complex information, or project visual identities, such as in the design of printed materials, packaging, advertising, signage systems, and logos. Commercial artists engaged exclusively in generating drawings and illustrations requiring technical accuracy or interpretative skills are included.	\
This industry includes entities that: 1. Write, modify, test, and support software to meet the  needs of a customer 2. Plan and design computer systems that integrate computer hardware, software, and communication  technologies; 3. Manage and operate clients' computer systems and/or  data processing facilities on-site 4. Provide other professional and technical computer-  related advice and services.	\
This industry includes entities that focus on creating, modifying, testing, and supporting software to meet the needs of a particular customer.	\
This industry includes entities that plan and design computer systems that integrate computer hardware, software, and communication technologies.	\
This industry includes entities that manage and/or operate clients' computer systems and/or data processing facilities (on-site or remote).	\
This industry includes entities that provide services and technologies to protect computer systems from unauthorized access, such as theft or damage to hardware, software, or electronic data, including the disruption or  misdirection of the services they provide.	\
This industry includes entities that provide training for and evaluation of IT systems and components.	\
This industry includes entities that provide IT services related to installing and deploying new IT systems, disaster recovery services, and/or uninstalling, and disposing of no- longer-needed IT systems or components.	\
This industry includes entities that advise on administrative and management issues, such as financial planning and asset management, records management, office planning, strategic and organizational planning, site selection, new business start-up, and business process improvement. This does not include IT or operations consulting.	\
This industry includes entities that provide advertising, public relations, and related services, such as the purchase of media, independent media representation, outdoor advertisement, direct mail advertisement, and  advertisement material distribution services.	\
This industry includes entities that provide operating advice and assistance to businesses and other  organizations in: 1. Manufacturing operations improvement 2. Productivity improvement 3. Production planning and control 4. Quality assurance and quality control 5. Inventory management 6. Distribution networks 7. Warehouse use, operations, and utilization 8. Transportation and shipment of goods and materials 9. Materials management and handling.	\
This industry includes entities that provide operating advice on the practice of outsourcing and/or offshoring.	\
This industry includes entities that provide advice and assistance to businesses and organizations on environmental issues, such as control of environmental contamination from pollutants, toxic substances, and hazardous materials. They employ experts in fields such as air and water quality, asbestos contamination, remediation, ecological restoration, and environmental law. Sanitation or site remediation consulting services are  included.	\
This industry includes entities that conduct original investigation undertaken on a systematic basis to gain new knowledge (research) and/or apply research findings or other scientific knowledge to create new or significantly improved products or processes (experimental development). Techniques may include modeling and  simulation.	\
This industry includes entities that conduct nanotechnology research and experimental development. Research may result in new nanotechnology processes and/or products that may be reproduced, utilized, or implemented by various industries.	\
This industry includes entities that conduct biotechnology  (except nanobiotechnology) research and experimental development.	\
This industry includes entities that conduct research and  analyses in sociology, psychology, economics, and other fields in social sciences and humanities.	\
This industry includes entities that provide operating advice and assistance to businesses and other organizations on marketing issues, such as developing marketing objectives and policies, sales forecasting, new product development and pricing, licensing and franchise  planning, and marketing planning and strategy.	\
This industry includes entities that design and implement public relations campaigns, i.e., campaigns to promote the interests and image of their clients. This includes lobbying, political consulting, and public relations consulting.	\
This industry includes entities aimed at impacting public policy at all levels of governance (local, regional, national and international) in order to promote the interests of a particular organization or group of organizations.	\
This industry includes entities that systematically gather,  record, tabulate, and present marketing and public opinion data.	\
This industry includes entities that provide still, video, or digital photography services. They may specialize in a particular field of photography, such as commercial and industrial photography, portrait photography, and special events photography. Commercial or portrait photography  studios are included.	\
This industry includes entities of licensed veterinary practitioners that practice veterinary medicine, dentistry, or surgery for animals. Entities that provide testing services for licensed veterinary practitioners are included.	\
This industry includes entities that hold equity interests in companies and enterprises for the purpose of owning a controlling interest or influencing management decisions. Entities in this industry don't have any of their own operations, but rather only have investments in other firms. Parent companies that have their own independent operations and also have subsidiaries are not included in  this industry.	\
This industry includes entities that perform routine support activities for the day-to-day operations of other organizations, including office administration, hiring and placing of personnel, document preparation and similar clerical services, solicitation, collection, security and surveillance services, cleaning, and waste disposal services.	\
This industry includes entities that provide a range of day- to-day office administrative services, such as financial planning; billing and recordkeeping; personnel; and physical distribution and logistics, for others on a contract  or fee basis.	\
This industry includes entities that provide operating staff who perform a combination of services within a client's facilities (excluding computer and/or data processing facilities), such as janitorial, maintenance, trash disposal, guard and security, mail routing, reception, and laundry. Entities that provide private jail services or operate correctional facilities on a contract or fee basis are  included.	\
This industry includes entities that clean building interiors,  interiors of transportation equipment (e.g., aircraft, rail cars, ships), and/or windows.	\
This industry includes entities that: 1. Provide landscape care and maintenance services and/or  installing trees, shrubs, plants, lawns, or gardens 2. Provide these services along with the design of landscape plans and/or the installation of walkways, retaining walls, decks, fences, ponds, and similar  structures.	\
This industry includes entities that provide staff for guard and patrol services, such as bodyguard, guard dog, and parking security services.	\
This industry includes entities that sell security systems hardware , such as burglar and fire alarms and locking devices, along with installation, repair, or remote  monitoring of electronic security alarm systems.	\
This industry includes entities that: 1. List employment vacancies and place or refer applicants  for employment 2. Provide executive search, recruitment, and placement  services 3. Supply workers to clients' businesses for limited periods  of time 4. Provide day-to-day human resources and human resources management services to client businesses and households. Human resources outsourcing firms are included in this industry. This industry does not include entities that provide consulting on human resources  policies and procedures.	\
This industry includes entities that provide executive search, recruitment, and placement services for clients with specific executive and senior management position requirements, including developing a search strategy and position specification based on the culture and needs of the client; researching, identifying, screening, and interviewing candidates; verifying candidate qualifications; and assisting in final offer negotiations and assimilation of  the selected candidate.	\
This industry includes entities that create documents or resumes, edit or proofread documents, transcribe documents, and/or provide other writing and editing  services.	\
This industry includes entities that translate written  material and interpret speech from one language to another.	\
This industry includes entities that 1. Answer telephone calls and relaying messages to clients  or 2. Provide telemarketing services on a contract or fee basis for others, such as promoting clients' products or services by telephone; taking orders for clients by telephone; and soliciting contributions or that provide information for  clients by telephone.	\
This industry includes entities that collect payments for  claims and remitting payments collected to their clients.	\
This industry includes entities that provide business support services, in particular fundraising organization  services on a contract or fee basis.	\
This industry includes entities that provide travel agency services, arrange or assemble tours, or provide other travel  arrangement and reservation services.	\
This industry includes entities that: 1. Provide investigation, guard, and armored car services 2. Sell security systems, such as burglar and fire alarms and locking devices, along with installation, repair, or  monitoring services 3. Provide remote monitoring of electronic security alarm  systems.	\
This industry includes entities that organize, promote, and/or manage events, such as business and trade shows, conventions, conferences, and meetings, held in facilities they manage and operate or in facilities that are managed  and operated by others.	\
This industry includes entities that provide instruction or training in a wide variety of subjects from specialized entities, such as schools, colleges, universities, and training  centers.	\
This industry includes entities that furnish academic courses and grant degrees at baccalaureate or graduate levels, where the requirement for admission is at least a high school diploma or equivalent general academic  training.	\
This industry includes entities that offer training courses in office skills, such as how to use software applications. Also included in this industry are entities that offer short-term courses for professional training. Computer repair training  is not included in this industry.	\
This industry includes entities that offer vocational and technical training in a variety of technical subjects and trades, including flight schools and apprenticeships but  excluding office skills.	\
This industry focuses on training for secretarial and  administrative staff and includes entities that offer courses in secretarial and other basic office skills.	\
This industry includes entities that offer training in barbering, hair styling, or the cosmetic arts, such as  makeup or skin care.	\
This industry includes entities that offer aviation and flight training.	\
This industry includes entities that offer instruction in the arts, including dance, art, drama, and music.	\
This industry includes entities, such as camps and schools,  that offer instruction in athletic activities to groups of individuals.	\
This industry includes entities that offer foreign language instruction (including sign language).	\
This industry includes entities that offer instruction using electronic technologies, such as through web-based trainings, online learning platforms, and live or recorded lectures. Training may be tuition-based or open to the  public, accredited or non-accredited.	\
This industry includes entities that provide health care and health-related social assistance for individuals. It includes entities that provide medical care exclusively, health care and social assistance, and only social assistance. These entities deliver services by trained professional health  practitioners or social workers.	\
This industry includes individual medical practices that provide health care services directly or indirectly to ambulatory patients. This industry does not include  hospitals.	\
This industry includes health practitioners having the degree of M.D. (Doctor of Medicine) or D.O. (Doctor of Osteopathy) practicing general or specialized medicine (e.g., anesthesiology, oncology, ophthalmology, psychiatry) or surgery. This category does not include clinics or  hospitals.	\
This industry includes health practitioners having the degree of D.M.D. (Doctor of Dental Medicine), D.D.S. (Doctor of Dental Surgery), or D.D.Sc. (Doctor of Dental Science) practicing general or specialized dentistry or  dental surgery.	\
This industry includes health practitioners having the  degree of D.C. (Doctor of Chiropractic) practicing chiropractic therapy.	\
This industry includes health practitioners having the  degree of O.D. (Doctor of Optometry) practicing optometry.	\
This industry includes independent mental health practitioners (except physicians) that diagnose and treat mental, emotional, and behavioral disorders and/or individual or group social dysfunction brought about by mental illness, alcohol and substance abuse, physical and emotional trauma, or stress. They operate private or group practices in their own offices or in the facilities of others  (e.g., hospitals).	\
This industry includes independent health practitioners who provide physical therapy services to patients who require prevention, wellness or fitness services; plan and administer educational, recreational, and social activities designed to help patients or individuals with disabilities regain physical or mental functioning or adapt to their disabilities; or diagnose and treat speech, language, or  hearing problems.	\
This industry includes independent health practitioners (except physicians; dentists; chiropractors; optometrists; mental health specialists; physical, occupational, and speech therapists; audiologists; and podiatrists), acupuncturists (except medical or osteopathic doctors), hypnotherapists, homeopaths, and naturopaths. These practitioners operate private or group practices in their own offices or in the facilities of others (e.g., hospitals).	\
This industry includes entities with medical staff that provide a range of family planning services on an outpatient basis, such as contraceptive services, genetic and prenatal counseling, voluntary sterilization, and therapeutic and medically induced termination of  pregnancy.	\
This industry includes entities such as clinics or hospitals with medical staff that provide general or specialized outpatient care (except family planning centers and outpatient mental health and substance abuse centers). Centers or clinics of health practitioners with different degrees from more than one industry practicing within the  same establishment are included in this industry.	\
This industry includes medical and diagnostic laboratories that provide analytic or diagnostic services, including body fluid analysis and diagnostic imaging, generally to the medical profession or to the patient on referral from a  health practitioner.	\
This industry includes entities that provide skilled nursing services in the home, along with a range of the following: personal care services; homemaker and companion services; physical therapy; medical social services; medication; support for medical equipment and supplies; counseling; 24-hour home care; occupation and vocational therapy; dietary and nutritional services; speech therapy; audiology; and high-tech care, such as intravenous therapy.	\
This industry includes entities that provide transportation of patients by ground or air, along with medical care.	\
This industry includes entities that provide residential care combined with either nursing, supervisory, or other types  of care as required by the residents.	\
This industry includes entities that provide nonresidential social assistance to children and youth, the elderly, persons with disabilities, and all other individuals and families.	\
This industry includes entities that provide food, shelter, clothing, medical relief, resettlement, and counseling to victims of domestic or international disasters or conflicts  (e.g., wars).	\
This industry includes entities that provide vocational rehabilitation or habilitation services, such as job counseling, job training, and work experience, to unemployed and underemployed persons, persons with disabilities, and persons who have a job market disadvantage because of lack of education, job skill, or experience and/or training and employment to persons  with disabilities.	\
This industry includes entities that provide day care of infants or children who are not in school and may also offer pre-kindergarten and/or kindergarten educational  programs.	\
This industry includes entities offer short-term emergency shelter, temporary residential shelter, transitional housing, volunteer construction or repair of low-cost housing; or food, shelter, clothing, medical relief, resettlement, and counseling to the needy, or to victims of domestic or international disasters or conflicts.	\
This industry includes entities that provide services in support of the elderly and disabled.	\
This industry includes entities that: 1. Produce, promote, or participate in live performances,  events, or exhibits intended for the public 2. Preserve and exhibit objects and sites of historical,  cultural, or educational interest 3. Operate facilities or provide services that enable patrons to participate in recreational activities or pursue  amusement, hobby, and leisure-time interests.	\
This industry includes companies, groups, or theaters producing all types of live theatrical dance (e.g., ballet,  contemporary dance, folk dance) presentations.	\
This industry includes companies or groups (except theater companies, dance companies, and musical groups and artists) producing live theatrical presentations.	\
This industry includes entities that preserve and exhibit  objects, sites, and natural wonders of historical, cultural, and/or educational value.	\
This industry includes entities that preserve and exhibit objects of historical, cultural, and/or educational value.	\
This industry includes entities that preserve and exhibit sites, buildings, forts, or communities that describe events or persons of particular historical interest, such as archeological sites, battlefields, historical ships, and  pioneer villages.	\
This industry includes entities that preserve and exhibit live plant and animal life displays.	\
This industry includes independent (i.e., freelance) individuals that perform in artistic productions, create artistic and cultural works, or provide technical expertise  necessary for these productions.	\
This industry includes 1. Groups that produce live musical entertainment (except  theatrical musical or opera productions) 2. Independent (i.e., freelance) artists that provide live musical entertainment. Musical groups and artists may perform in front of a live audience or in a studio; they may or may not operate their own facilities for staging shows.	\
This industry includes entities that operate gambling facilities, such as casinos, bingo halls, and video gaming terminals, or that provision gambling services, such as  lotteries and off-track betting.	\
This industry includes entities that 1. Operate golf courses (except miniature) and 2. Operate golf courses along with dining facilities and  other recreational facilities that are known as country clubs.	\
This industry includes entities that: 1. Operate fitness and recreational facilities for sports,  such as swimming, skating, or racquet sports; and/or 2. Provide non-medical services to assist clients in attaining or maintaining a desired weight or healthfulness, such as individual or group counseling and menu and exercise  planning.	\
This industry includes entities that provide customers with  lodging and/or prepared meals, snacks, and beverages for immediate consumption.	\
This industry includes entities that provide short-term  lodging specifically in facilities known as hotels, motor hotels, resort hotels, and motels.	\
This industry includes entities that provide short-term lodging and food (except hotels, motels, and casino hotels).	\
This industry includes entities that prepare meals, snacks, and beverages to customer order, for immediate on-  premises and off-premises consumption.	\
This industry includes entities that provide food to patrons who are served while seated and pay after eating, or those who select items (e.g., at a counter, in a buffet line) and pay before eating. Entities that prepare and/or serve specialty snacks and/or nonalcoholic beverages for consumption on or near the premises are included.	\
This industry includes entities known as bars, taverns,  nightclubs, or drinking places preparing and serving alcoholic beverages for immediate consumption.	\
This industry includes entities that provide single event- based food services and generally have equipment and vehicles to transport meals and snacks to events and/or  prepare food at an off-premise site.	\
This industry includes entities that prepare and serve meals and snacks for immediate consumption from motorized vehicles or nonmotorized carts. The entity is the central location from which the caterer route is serviced, not each vehicle or cart. Included in this industry are entities that provide food services from vehicles, such as hot dog carts  and ice cream trucks.	\
This industry includes entities that repair cars, machinery, electronics, furniture, footwear, and leather goods, and those that provide personal services such as laundry, pet  care, and household services.	\
This industry includes entities that restore machinery, equipment, and other products to working order and provide general or routine maintenance (i.e., servicing) on such products to ensure they work efficiently and to  prevent breakdown and unnecessary repairs.	\
This industry includes entities that provide repair and maintenance services for automotive vehicles, such as  passenger cars, trucks, and vans, and all trailers.	\
This industry includes entities that repair and maintain one  or more of the following: 1. Consumer electronic equipment 2. Computers 3. Office machines 4. Communication equipment 5. Other electronic and precision equipment and  instruments, without retailing these products as new.	\
This industry includes entities that offer one or more of the  following services: 1. Reupholstering furniture 2. Refinishing furniture 3. Repairing furniture 4. Repairing and restoring furniture.	\
This industry includes entities that provide personal and laundry services to individuals, households, and businesses, including personal care services; death care services; laundry and drycleaning services; and a wide range of other personal services, such as pet care (except veterinary) services, photofinishing services, temporary  parking services, and dating services.	\
This industry includes entities, such as barber and beauty shops, that provide appearance care services to individual  consumers.	\
This industry includes entities that operate coin-operated or similar self-service laundries and drycleaners; that provide drycleaning and laundry services (except coin- operated); and supply, on a rental or contract basis, laundered items (e.g., uniforms, gowns, shop towels, etc.).	\
This industry includes entities that provide pet care services (except veterinary), such as boarding, grooming,  sitting, and training pets.	\
This industry includes religious organizations, such as churches, religious temples, and monasteries, and/or entities that organize religion or promote religious  activities.	\
This industry includes grantmaking foundations, charitable trusts, and entities that raise funds for a wide range of social welfare activities, such as health, educational,  scientific, and cultural activities.	\
This industry includes entities that organize religious activities; promote causes and beliefs for the public good; support charitable and other causes through grantmaking; advocate social and political causes; and promote and  defend the interests of their members.	\
This industry includes entities that promote the interests of national or local parties or candidates. Political groups organized to raise funds for a political party or individual  candidate are included.	\
This industry includes entities that promote the business interests of their member companies and may conduct research on new products and services; develop market statistics; sponsor quality and certification standards; lobby public officials; or publish newsletters, books, or  periodicals for distribution to their members.	\
This industry includes entities that promote the professional interests of their individual members and their profession as a whole; and may conduct research; develop statistics; sponsor quality and certification standards; lobby public officials; or publish newsletters, books, or  periodicals for distribution to their members.	\
This industry includes entities that provide public benefit on a nonprofit basis, including those that organize and promote religious activities, support social and political causes, and provide programs and facilities for emergency relief, education, and donations of goods and services.	\
This industry includes private households that employ workers on or about the premises in activities primarily concerned with the operation of the household, including cooks, maids, butlers, and outside workers, such as gardeners, caretakers, and other maintenance workers.	\
This industry includes entities of federal, state, and local government agencies that administer, oversee, and manage public programs; organize and finance public goods and services; and have executive, legislative, or judicial authority over other institutions within a given area. These agencies set policy, create laws, adjudicate civil and criminal legal cases, and provide for public safety and  national defense.	\
This industry includes offices of government executives, legislative bodies, public finance, and general government  support.	\
This industry includes government entities that serve as offices of chief executives and their advisory committees  and commissions.	\
This industry includes government entities that serve as  legislative bodies and their advisory committees and commissions.	\
This industry includes government entities that administer  justice, including courts, correctional institutions, and other offices.	\
This industry includes civilian courts of law (except American Indian and Alaska Native tribal courts).	\
This industry includes government entities that manage and operate correctional institutions designed for the confinement, correction, and rehabilitation of adult and/or  juvenile offenders sentenced by a court.	\
This industry includes government entities that offer firefighting and other related fire protection activities.	\
This industry includes government entities that enforce criminal and civil law, provide police activity, traffic safety, and other activities related to the enforcement of the law and preservation of order. Combined police and fire  departments are included.	\
This industry includes government entities that provide public order and safety (except courts, police protection, legal counsel and prosecution, correctional institutions, parole offices, probation offices, pardon boards, and fire protection). Government administration of public order, safety programs, and collection of statistics on public  safety are included.	\
This industry includes government entities that administer  human resource programs.	\
This industry includes government entities that coordinate, plan, supervise, and administrate funds, policies, activities, statistical reports, data collection, and centralized programs for educational administration. Government scholarship programs are included.	\
This industry includes government entities that plan, administer, and coordinate public health programs and services, including environmental health activities, mental health, categorical health programs, health statistics, and  immunization services.	\
This industry includes government entities that plan, administer, and coordinate programs for public assistance, social work, and welfare activities, including Social Security, disability insurance, Medicare, unemployment insurance, and workers' compensation programs.	\
This industry includes government entities that administer  environmental quality programs.	\
This industry includes government entities that focus on  administration, regulation, or enforcement of programs related to one or more of the following: 1. Air and water resources 3. Solid waste management 2. Water and air pollution control and prevention 4. Flood control 5. Drainage development and water resource consumption 6. Toxic waste removal and cleanup; and/or coordination of these activities at intergovernmental levels.	\
This industry includes government entities that administer programs for housing, urban planning, and community  development.	\
This industry includes government entities that plan and administer housing programs.	\
This industry includes government entities that focus on the administration and planning of the development of urban and rural areas, including government zoning boards  and commissions.	\
This industry includes government entities that administer  economic programs.	\
This industry includes government entities that focus on the administration, regulation, licensing, planning, inspection, and investigation of transportation services and facilities, including motor vehicle and operator licensing, the Coast Guard (except the Coast Guard Academy), and  parking authorities.	\
This industry includes government entities that focus on administration, regulation, licensing, and inspection of utilities, such as communications, electric power (including fossil, nuclear, solar, water, and wind), gas and water  supply, and sewerage.	\
This industry includes government entities that administer  and operate space flights, space research, space exploration, and space flight centers.	\
This industry includes government entities that administer programs of national security and international affairs.	\
This industry includes government entities engaged in national security and related activities.	\
This industry includes entities of local and foreign  governments that focus on international affairs and programs relating to other nations and peoples.	\
This industry includes entities that produce technology products, such as software and data analytics, and provide the means to transmit or distribute these products. Also included are motion picture and sound recording; traditional broadcasting and broadcasting exclusively over the Internet; telecommunications; data processing; and Web search portals and information services.	\
This industry includes entities that provide telecommunications and related services and media production and distribution, including broadcast media,  movies, sound recordings, and animation	\
This industry includes entities that publish computer software, provide data infrastructure and analytics, provide web-based platforms (including marketplace platforms and social media platforms, and media streaming services), and provide information services, including internet publishing  and libraries.	\
This industry includes entities that perform professional, scientific, and technical activities for others, including legal advice and representation; accounting, bookkeeping, and payroll services; architectural, engineering, and specialized design services; computer services; consulting services; research services; advertising services; photographic services; translation and interpretation services; veterinary services; and other professional, scientific, and technical  services.";

    const industiresArr = industries.split('\t');
    const industryDescriptionsArr = industryDescriptions.split('\t');
    const allIndustriesSet: Set<string> = new Set();
    const industryHeirarchy: Record<string, Object> = {};

    for (let i = 0; i < industiresArr.length; i++) {
        if (industiresArr[i].includes('>')) {
            const subIndustries = industiresArr[i].split('>');
            let parentIndustryNode: any = industryHeirarchy[`%[IndustryType.${subIndustries[0].trim().toUpperCase().replace(/-/g, '_').replace(/,/g, '').replace(/\s/g, '_').replace(/__/g, '_')}]@`];
            if (parentIndustryNode === undefined) {
                industryHeirarchy[`%[IndustryType.${subIndustries[0].trim().toUpperCase().replace(/-/g, '_').replace(/,/g, '').replace(/\s/g, '_').replace(/__/g, '_')}]@`] = {
                    type: `%IndustryType.${subIndustries[0].trim().toUpperCase().replace(/-/g, '_').replace(/,/g, '').replace(/\s/g, '_').replace(/__/g, '_')}@`,
                    subIndustries: {},
                    description: industryDescriptionsArr[i]
                };
                parentIndustryNode = industryHeirarchy[`%[IndustryType.${subIndustries[0].trim().toUpperCase().replace(/-/g, '_').replace(/,/g, '').replace(/\s/g, '_').replace(/__/g, '_')}]@`];
                allIndustriesSet.add(subIndustries[0].trim())
            }
            subIndustries.shift();
            subIndustries.forEach(subIndus => {
                const trimmedSubIndus = subIndus.trim();
                allIndustriesSet.add(trimmedSubIndus)
                if (!parentIndustryNode.subIndustries[`%[IndustryType.${trimmedSubIndus.trim().toUpperCase().replace(/-/g, '_').replace(/,/g, '').replace(/\s/g, '_').replace(/__/g, '_')}]@`]) {
                    parentIndustryNode.subIndustries[`%[IndustryType.${trimmedSubIndus.trim().toUpperCase().replace(/-/g, '_').replace(/,/g, '').replace(/\s/g, '_').replace(/__/g, '_')}]@`] = {
                        type: `%IndustryType.${trimmedSubIndus.trim().toUpperCase().replace(/-/g, '_').replace(/,/g, '').replace(/\s/g, '_').replace(/__/g, '_')}@`,
                        subIndustries: {},
                        description: industryDescriptionsArr[i]
                    };
                }
                parentIndustryNode = parentIndustryNode.subIndustries[`%[IndustryType.${trimmedSubIndus.trim().toUpperCase().replace(/-/g, '_').replace(/,/g, '').replace(/\s/g, '_').replace(/__/g, '_')}]@`];
            });
        }
        else {
            industryHeirarchy[`%[IndustryType.${industiresArr[i].trim().toUpperCase().replace(/-/g, '_').replace(/,/g, '').replace(/\s/g, '_').replace(/__/g, '_')}]@`] = {
                type: `%IndustryType.${industiresArr[i].trim().toUpperCase().replace(/-/g, '_').replace(/,/g, '').replace(/\s/g, '_').replace(/__/g, '_')}@`,
                subIndustries: {},
                description: industryDescriptionsArr[i]
            };
            allIndustriesSet.add(industiresArr[i].trim());
        }
    };

    const allIndustriesAsArr = [];

    allIndustriesSet.forEach(indus => allIndustriesAsArr.push(indus.toUpperCase().replace(/-/g, '_').replace(/,/g, '').replace(/\s/g, '_').replace(/__/g, '_') + ` = '${indus}'`));
};
