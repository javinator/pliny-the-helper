# ![Pliny the Helper](/src/assets/img/pliny_light.png)

Ionic based multiplatform brew-helper using BeerXML.

## Description

Pliny the Helper is an app to help a brew master organize and create recipes.
It is compatible with the open BeerXML standard.

While creating a new recipe, Pliny will help you adhere to a given beer style
with tons of different ingredients (malts, hops, yeasts and miscellaneous) to
choose from. It then calculates the beer for the chosen batch size, with all the
metrics like gravity, color and estimated ABV.

But there is also a beer style explorer with over 40 different styles and their
typical aromas and ingredients. The same goes for all the ingredients, if you
ever wondered where the hop you're using comes from, or what some typical
qualities of the malt you are using are.

Additionally, there are some handy calculators to help you convert metric to imperial
or to adjust your hydrometer reading to the actual temperature or for using your
refractometer post fermentation.

And of course you can tweak your settings to accommodate your brewing equipment.

If you want to get started with some recipes, you'll find my 40 first recipes [here](src/assets/xml/40-recipes.xml).

### Formulas

Here I list some of the used formulas I used, for better understanding.

#### ABV

For calculating the ABV I used the following formula:

ABV = (76.08 * (og-fg) / (1.775-og)) * (fg / 0.794)

#### Plato/Brix/SG

For converting specific gravity to Plato/Brix I use the following formula:

B = (((182.4601 * SG - 775.6821) * SG + 1262.7794) * SG - 669.5622)

For converting Brix to specific gravity the following was used:

SG = (B / (258.6 - ((B / 258.2) * 227.1))) + 1

***Note:*** *For home brewing purposes Brix and Plato are essentially interchangeable (same out to 3 decimal places).*

#### Color

I use the Morey Equation to calculate color:

MCU = (Lovibond * GrainWeight_lbs)/BatchSize_gal

SRM = 1.4922 * (MCU ^ 0.6859)

#### Bitterness

To estimate bitterness I used Glenn Tinseth's formula:

IBU = (U * HopWeight_oz * 7490)/BoilSize_gal

U = BignessFactor * TimeFactor

BignessFactor = 1.65 * 0.000125 ^ (SG - 1)

TimeFactor = (1 - e ^ (-0.04 * Time_min)) / KettleUtil

The Kettle Utilization defined by Glenn Tinseth is 4.15 for his system. Default value I used is 4.20 (higher value = slightly lower utilization), as it better represents my system. Can be adjusted in the app constants ([app.constants.ts](src/app/app.constants.ts))

#### Strike Temperature

To calculate the strike temperature of the water I use the following formula:

Tw = (0.41 / R)(T2 – T1) + T2

R = Ratio of grain to water in the mash
T1 = Initial Temperature (of the grain)
T2 = Mash Temperature

#### Refractometer

I implemented both widely regarded formulas to determine the final gravity of a beer, namely P. Novotny's quadratic and S. Terrill's cubic formulas.

##### Novotny

FG = 1 + 0.00001335 * Ri ^ 2 - 0.00003239 * Ri * Rf + 0.00002916 * Rf ^ 2 - 0.002421 * Ri + 0.006219 * Rf;

##### Terrill

FG = 1 - 0.0044993 * Ri + 0.011774 * Rf + 0.00027581 * Ri ^ 2 - 0.0012717 * Rf ^ 2 - 0.00000728 * Ri ^ 3 + 0.000063293 * Rf ^ 3;

Ri = initial Brix reading
Rf = final Brix reading

----

### Links

* [Ionic Documentation](https://ionicframework.com/docs/)
* [Ionic Components](https://ionicframework.com/docs/components)
* [BeerXML](http://www.beerxml.com/)

### License

Pliny the Helper is licensed as beerware.[*](https://fedoraproject.org/wiki/Licensing/Beerware)

"THE BEER-WARE LICENSE" (Revision 42):

<mail@vincehofer.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return
