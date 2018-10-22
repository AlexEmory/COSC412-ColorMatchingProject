import java.util.*;
public class paintMixing{
  public static void main(String[] args){
    Scanner input=new Scanner(System.in);
    double[] paintC={90,50,10,59};
    double[] paintM={0,80,75,50};
    double[] paintY={0,25,55,0};
    double[] paintK={10,5,2,90};
    double[] spectColor={50,50,50,50};
    double[] solution;
    
    System.out.println("Enter the CMYK values for the paint with the most Cyan");
    for(int i=0;i<4;i++){
      paintC[i]=input.nextInt();
    }
    
    System.out.println("Enter the CMYK values for the paint with the most Magenta");
    for(int i=0;i<4;i++){
      paintM[i]=input.nextInt();
    }
    
    System.out.println("Enter the CMYK values for the paint with the most Yellow");
    for(int i=0;i<4;i++){
      paintY[i]=input.nextInt();
    }
    
    System.out.println("Enter the CMYK values for the paint with the most White");
    for(int i=0;i<4;i++){
      paintK[i]=input.nextInt();
    }
    
    System.out.println("Enter the CMYK values for the paint from the Spectrophotometer");
    for(int i=0;i<4;i++){
      spectColor[i]=input.nextInt();
    }
    
    input.close();
    
    System.out.print("The ratios are: ");
    solution=paintApprox4D(spectColor,paintC,paintM,paintY,paintK,10);
    System.out.println(solution[0]+" "+solution[1]+" "+solution[2]+" "+solution[3]);
    
    System.out.print("The final color arrived at was: ");
    System.out.print(solution[0]*paintC[0]+solution[1]*paintM[0]+solution[2]*paintY[0]+solution[3]*paintK[0]+" ");
    System.out.print(solution[0]*paintC[1]+solution[1]*paintM[1]+solution[2]*paintY[1]+solution[3]*paintK[1]+" ");
    System.out.print(solution[0]*paintC[2]+solution[1]*paintM[2]+solution[2]*paintY[2]+solution[3]*paintK[2]+" ");
    System.out.print(solution[0]*paintC[3]+solution[1]*paintM[3]+solution[2]*paintY[3]+solution[3]*paintK[3]+" ");
  }
  
  public static double[] paintApprox4D(double[] spectColor, double[] cyanBase, double[] magentaBase, double[] yellowBase, double[] keyBase, int pass){
    //CMYK colors for scanned color, CMYK colors for majority cyan color, CMYK magenta, CMYK yellow, CMYK white or black, number of passes
    if(spectColor[0]>cyanBase[0]||spectColor[1]>magentaBase[1]||spectColor[2]>yellowBase[2]||spectColor[3]>keyBase[3]) //cyanBase is the vector with highest x-value
      return null;
    double temp;
    double[] solution={0,0,0,0};
    double[] currentHue=new double[4];
    
    for(int x=0;x<pass;x++){
      temp=(spectColor[0]-currentHue[0])/cyanBase[0];      //Set x-Color to spectColor value based on cyanBase
      solution[0]+=temp;
      currentHue[0]=currentHue[0]+temp*cyanBase[0];
      currentHue[1]=currentHue[1]+temp*cyanBase[1];
      currentHue[2]=currentHue[2]+temp*cyanBase[2];
      currentHue[3]=currentHue[3]+temp*cyanBase[3];
      
      temp=(spectColor[1]-currentHue[1])/magentaBase[1];       //Set y-Color to spectColor value based on magentaBase
      solution[1]+=temp;
      currentHue[0]=currentHue[0]+temp*magentaBase[0];
      currentHue[1]=currentHue[1]+temp*magentaBase[1];
      currentHue[2]=currentHue[2]+temp*magentaBase[2];
      currentHue[3]=currentHue[3]+temp*magentaBase[3];
      
      
      temp=(spectColor[2]-currentHue[2])/yellowBase[2];       //Set z-Color to spectColor value based on yellowBase
      solution[2]+=temp;
      currentHue[0]=currentHue[0]+temp*yellowBase[0];
      currentHue[1]=currentHue[1]+temp*yellowBase[1];
      currentHue[2]=currentHue[2]+temp*yellowBase[2];
      currentHue[3]=currentHue[3]+temp*yellowBase[3];
      
      if(x<pass-1){
        temp=(spectColor[3]-currentHue[3])/keyBase[3];       //Set z-Color to spectColor value based on keyBase
        solution[3]+=temp;
        currentHue[0]=currentHue[0]+temp*keyBase[0];
        currentHue[1]=currentHue[1]+temp*keyBase[1];
        currentHue[2]=currentHue[2]+temp*keyBase[2];
        currentHue[3]=currentHue[3]+temp*keyBase[3];
      }
        
      //System.out.println("After Both Checks: "+currentHue[0]+" "+currentHue[1]+" "+currentHue[2]);
      //System.out.println("Current Ratio: "+solution[0]+" "+solution[1]+" "+solution[2]);
    }
    return solution;
  }
  
 /* public static double[] paintApprox3D(double[] spectColor, double[] cyanBase, double[] magentaBase, double[] yellowBase){
    if(spectColor[0]>cyanBase[0]||spectColor[1]>magentaBase[1]||spectColor[2]>yellowBase[2]) //cyanBase is the vector with highest x-value
      return null;
    double temp;
    double[] solution={0,0,0};
    double[] currentHue=new double[3];
    
    for(int x=0;x<10;x++){
      temp=(spectColor[0]-currentHue[0])/cyanBase[0];      //Set x-Color to spectColor value based on cyanBase
      solution[0]+=temp;
      currentHue[0]=currentHue[0]+temp*cyanBase[0];
      currentHue[1]=currentHue[1]+temp*cyanBase[1];
      currentHue[2]=currentHue[2]+temp*cyanBase[2];
      
      temp=(spectColor[1]-currentHue[1])/magentaBase[1];       //Set y-Color to spectColor value based on magentaBase
      solution[1]+=temp;
      currentHue[0]=currentHue[0]+temp*magentaBase[0];
      currentHue[1]=currentHue[1]+temp*magentaBase[1];
      currentHue[2]=currentHue[2]+temp*magentaBase[2];
      
      
      temp=(spectColor[2]-currentHue[2])/yellowBase[2];       //Set z-Color to spectColor value based on yellowBase
      solution[2]+=temp;
      currentHue[0]=currentHue[0]+temp*yellowBase[0];
      currentHue[1]=currentHue[1]+temp*yellowBase[1];
      currentHue[2]=currentHue[2]+temp*yellowBase[2];
      
      System.out.println("After Both Checks: "+currentHue[0]+" "+currentHue[1]+" "+currentHue[2]);
      System.out.println("Current Ratio: "+solution[0]+" "+solution[1]+" "+solution[2]);
    }
    return solution;
  }
  public static double[] paintApprox2D(double[] spectColor, double[] cyanBase, double[] magentaBase){
    if(spectColor[0]>cyanBase[0]||spectColor[0]<magentaBase[0]||spectColor[1]>magentaBase[1]||spectColor[1]<cyanBase[1])
      return null;
    double temp;
    double[] solution={0,0};
    double[] currentHue=new double[2];
    /*temp=spectColor[0]/cyanBase[0];
     System.out.println(temp);
     solution[0]+=temp;
     currentHue[0]=cyanBase[0]*temp;
     currentHue[1]=cyanBase[1]*temp;
    for(int x=0;x<10;x++){
      temp=(spectColor[0]-currentHue[0])/cyanBase[0];
      solution[0]+=temp;
      currentHue[0]=currentHue[0]+temp*cyanBase[0];
      currentHue[1]=currentHue[1]+temp*cyanBase[1];
      
      temp=(spectColor[1]-currentHue[1])/magentaBase[1];
      solution[1]+=temp;
      currentHue[0]=currentHue[0]+temp*magentaBase[0];
      currentHue[1]=currentHue[1]+temp*magentaBase[1];
      
      System.out.println("After Both Checks: "+currentHue[0]+" "+currentHue[1]);
      System.out.println("Current Ratio: "+solution[0]+" "+solution[1]);
    }
    return solution;
  }*/
}
