# Pliny the Helper

Ionic based multiplatform brew-helper.

## Description

Pliny the Helper is an app to help a brewmaster organize and create recipes. It is compatible with the open BeerXML
standard.

## Formulas

### ABV

For calculating the ABV I used the following formula:

ABV = (76.08 * (og-fg) / (1.775-og)) * (fg / 0.794)

### Plato/Brix/SG

For converting specifig gravity to Plato/Brix I use the following formula:

B = (((182.4601 * SG - 775.6821) * SG + 1262.7794) * SG - 669.5622)

For converting Brix to specific gravity the following was used:

SG = (B / (258.6 - ((B / 258.2) * 227.1))) + 1

***Note:*** *For home brewing purposes Brix and Plato are essentially interchangeable (same out to 3 decimal places).*

### Color

I use the Morey Equation to calculate color:

MCU = (Lovibond * GrainWeight_lbs)/BatchSize_gal

SRM = 1.4922 * (MCU ^ 0.6859)

### Bitterness

To estimate bitternes I used Glenn Tinseth's formula:

IBU = (U * HopWeight_oz * 7490)/BoilSize_gal

U = BignessFactor * TimeFactor

BignessFactor = 1.65 * 0.000125 ^ (SG - 1)

TimeFactor = (1 - e ^ (-0.04 * Time_min)) / 4.15

### Links

* [Ionic Documentation](https://ionicframework.com/docs/)
* [Ionic Componenets](https://ionicframework.com/docs/components)
* [BeerXML](http://www.beerxml.com/)
