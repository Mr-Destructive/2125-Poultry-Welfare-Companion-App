package com.example.chickfeed

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.constraintlayout.widget.ConstraintSet
import androidx.viewbinding.ViewBinding

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val waterLayout = findViewById<ConstraintLayout>(R.id.waterLayout)
        val ventilationLayout = findViewById<ConstraintLayout>(R.id.ventilationLayout)
        val sleepLayout = findViewById<ConstraintLayout>(R.id.sleepLayout)
        val litterLayout = findViewById<ConstraintLayout>(R.id.litterLayout)
        val temperatureLayout = findViewById<ConstraintLayout>(R.id.temperatureLayout)


        waterLayout.setOnClickListener {
            startActivity(Intent(applicationContext, WaterActivity::class.java))
        }
        ventilationLayout.setOnClickListener {
            startActivity(Intent(applicationContext, VentilationActivity::class.java))
        }
        sleepLayout.setOnClickListener {
            startActivity(Intent(applicationContext, SleepActivity::class.java))
        }
        litterLayout.setOnClickListener {
            startActivity(Intent(applicationContext, LitterActivity::class.java))
        }
        temperatureLayout.setOnClickListener {
            startActivity(Intent(applicationContext, TemperatureActivity::class.java))
        }

    }
}