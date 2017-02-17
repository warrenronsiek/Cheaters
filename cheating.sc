import org.apache.spark.sql.SparkSession
import org.apache.spark.ml.clustering.KMeans
import org.apache.spark.ml.feature.VectorAssembler
import org.apache.spark.sql.functions._

val spark = SparkSession
  .builder().master("local")
  .appName("Spark SQL basic example")
  .config("master", "spark://myhost:7077")
  .getOrCreate()

val sqlContext = spark.sqlContext

import sqlContext.implicits._

val people = spark.read
  .json("/pathtodata/am_am_chunks/*")
  .select($"city", $"gender")
  .na.drop()
  .groupBy($"city")
  .pivot("gender")
  .agg(count("*").alias("total"))
  .drop("")
  .drop("0")
  .withColumnRenamed("1", "female")
  .withColumnRenamed("2", "male")
  .na.fill(0)
  .withColumn("peopleCity", lower($"city"))
  .drop("city")

val cities = spark.read.format("com.databricks.spark.csv")
  .option("header", "true")
  .option("inferSchema", "true")
  .option("delimiter", "\t")
  .load("/pathtodata/cities15000.tsv")
  .select($"name", $"asciiname", $"longitude", $"latitude")
  .withColumn("cityascii", lower($"asciiname"))
  .withColumn("city", lower($"name"))
  .drop("name")
  .drop("asciiname")
  .na.drop()

val joined = people.join(cities, $"peopleCity" === $"cityascii", "inner")

val assembler =
  new VectorAssembler()
    .setInputCols(Array("longitude", "latitude"))
    .setOutputCol("features")
val lonLatDf = assembler.transform(joined)


val kMeans = new KMeans().setK(100).setSeed(1L)
val model = kMeans.fit(lonLatDf)
val kmdf = model.setFeaturesCol("features")
  .setPredictionCol("centroid")
  .transform(lonLatDf)
  .drop("features")
  .drop("peopleCity")
  .drop("city")
  .drop("cityascii")
  .groupBy($"centroid")
  .agg(
    avg($"longitude").alias("longitude"),
    avg($"latitude").alias("latitude"),
    sum($"female").alias("female"),
    sum($"male").alias("male"))

kmdf.write.format("com.databricks.spark.csv")
  .option("header", "true")
  .save("/pathtodata/kmeans.csv")
spark.stop()
