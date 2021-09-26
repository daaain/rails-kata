class EnableHalfStarRatings < ActiveRecord::Migration[6.1]
  def change
    change_column :reviews, :rating, :decimal, precision: 2, scale: 1
  end
end
